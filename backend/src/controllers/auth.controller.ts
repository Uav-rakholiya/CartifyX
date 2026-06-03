import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { auth, db } from '../config/firebase.config';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name,
            email,
            passwordHash,
            phone
        });

        await user.save();

        // Firebase Sync: Also create the user in Firebase Auth and Firestore
        try {
            const firebaseUser = await auth.createUser({
                email,
                password,
                displayName: name
            });

            await db.collection('users').doc(firebaseUser.uid).set({
                name,
                email,
                phone: phone || '',
                role: 'user',
                mongoId: user.id,
                createdAt: new Date()
            });
            console.log('Firebase user successfully created and synced.');
        } catch (firebaseErr: any) {
            console.error('Firebase sync error during registration:', firebaseErr.message);
            // We just log the error and continue with the standard token creation
            // so that if Firebase fails, the user still successfully completes registration in MongoDB.
        }

        // Create Token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check User
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Match Password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create Token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).select('-passwordHash -__v -resetPasswordToken -resetPasswordExpire -resetPasswordOtp -resetPasswordOtpExpire');
        res.json(user);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};

export const firebaseSocialLogin = async (req: Request, res: Response) => {
    try {
        const { idToken, provider } = req.body;

        // Verify Firebase ID Token
        const decodedToken = await auth.verifyIdToken(idToken);
        const { email, name, picture, uid } = decodedToken;

        let userEmail = email;

        if (!userEmail) {
            console.warn('Email missing in token, using placeholder:', decodedToken);
            // Generate a consistent placeholder email based on UID
            userEmail = `${uid}@${provider || 'social'}.placeholder`;
        }

        // Check if user exists, otherwise create
        let user = await User.findOne({ email: userEmail });

        if (!user) {
            user = new User({
                name: name || userEmail.split('@')[0],
                email: userEmail,
                passwordHash: `${(provider || 'social').toUpperCase()}_AUTH_USER`,
                role: 'user'
            });
            await user.save();
        }

        // Create JWT Token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err: any) {
        console.error('Social login error:', err);

        return res.status(401).json({
            message: 'Invalid social authentication token',
            error: err?.message
        });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        // Generate Token (simple random string for now, in production use crypto)
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Hash and set to resetPasswordToken field
        user.resetPasswordToken = await bcrypt.hash(resetToken, 10);
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/auth/reset-password/${resetToken}?email=${email}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            // Dynamic import to avoid issues if module not installed yet
            const sendEmail = (await import('../utils/email')).default;

            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message
            });

            console.log('FORGOT PASSWORD REQUEST PROCESSED', resetUrl);
            res.status(200).json({
                success: true,
                data: 'Email sent',
                // For dev/testing only - Commented out to test real email flow
                // resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
            });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const forgotPasswordMobile = async (req: Request, res: Response) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ message: 'User not found with this phone number' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP and save
        const salt = await bcrypt.genSalt(10);
        user.resetPasswordOtp = await bcrypt.hash(otp, salt);
        user.resetPasswordOtpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes

        await user.save();

        const message = `Your CartifyX Password Reset OTP is: ${otp}. Valid for 10 minutes.`;

        try {
            // Dynamic import
            const sendSMS = (await import('../utils/sms')).default;

            await sendSMS({
                phone: user.phone || phone,
                message
            });

            res.status(200).json({
                success: true,
                data: 'OTP sent to mobile number',
                // For dev/testing only
                otp: process.env.NODE_ENV === 'development' ? otp : undefined
            });
        } catch (err) {
            console.error(err);
            user.resetPasswordOtp = undefined;
            user.resetPasswordOtpExpire = undefined;

            await user.save();

            return res.status(500).json({ message: 'SMS could not be sent' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { phone, otp } = req.body;
        const user = await User.findOne({
            phone,
            resetPasswordOtpExpire: { $gt: Date.now() }
        });

        if (!user || !user.resetPasswordOtp) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }

        const isMatch = await bcrypt.compare(otp, user.resetPasswordOtp);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP verified - return a temporary token for resetting password
        // Or simply return success and let client pass OTP again to resetPassword (simpler for now)
        // Ideally we issue a temporary JWT, but for simplicity we will verify OTP again in resetPasswordMobile

        // Let's create a specific reset token that the client can use to finalize the reset
        const resetToken = Math.random().toString(36).substring(2, 15);
        user.resetPasswordToken = await bcrypt.hash(resetToken, 10);
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

        // Clear OTP after successful verification to prevent reuse
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpire = undefined;

        await user.save();

        res.json({
            success: true,
            message: 'OTP Verified',
            resetToken: resetToken // Client will use this to call reset-password
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { resetToken, email, password } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user || !user.resetPasswordToken) {
            return res.status(400).json({ message: 'Invalid token or token expired' });
        }

        // Verify token
        const isMatch = await bcrypt.compare(resetToken, user.resetPasswordToken);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Send token response like login
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

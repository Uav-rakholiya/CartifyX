import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';

dotenv.config();

const verifyAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urbancart');
        console.log('MongoDB Connected');

        const email = 'admin@gmail.com';
        const newPassword = 'admin123';

        const user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.name} (${user.email})`);
            console.log(`Role: ${user.role}`);

            // Force reset password to be sure
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(newPassword, salt);
            user.role = 'admin'; // Ensure admin
            await user.save();
            console.log('Password reset successfully to: ' + newPassword);
        } else {
            console.log('User NOT found. Creating now...');
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(newPassword, salt);

            const newUser = new User({
                name: 'Admin User',
                email,
                passwordHash,
                role: 'admin'
            });

            await newUser.save();
            console.log('Admin user created successfully with password: ' + newPassword);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

verifyAdmin();

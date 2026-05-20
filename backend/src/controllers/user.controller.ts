import { Request, Response } from 'express';
import User from '../models/user.model';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-passwordHash -__v -resetPasswordToken -resetPasswordExpire -resetPasswordOtp -resetPasswordOtpExpire'); // Exclude sensitive fields
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle role basically or set specific if body provided?
        // Let's implement toggle for simplicity or specific set
        user.role = user.role === 'admin' ? 'user' : 'admin';
        await user.save();

        const { passwordHash, __v, resetPasswordToken, resetPasswordExpire, resetPasswordOtp, resetPasswordOtpExpire, ...safeUser } = user.toObject();

        res.json({ message: `User role updated to ${user.role}`, user: safeUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
};

export const addAddress = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { street, city, state, postalCode, country, isDefault } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newAddress = { street, city, state, postalCode, country, isDefault: isDefault || false };

        if (!user.addresses) {
            user.addresses = [];
        }

        // If this is the new default, unset others
        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        // If it's the first address, make it default automatically
        if (user.addresses.length === 0) {
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        await user.save();

        res.json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { addressId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.addresses) {
            user.addresses = user.addresses.filter(addr => addr._id?.toString() !== addressId);
            await user.save();
        }

        res.json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

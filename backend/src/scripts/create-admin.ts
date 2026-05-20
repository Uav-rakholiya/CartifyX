import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urbancart');
        console.log('MongoDB Connected');

        const email = 'admin@gmail.com';
        const password = 'admin123';

        let user = await User.findOne({ email });
        if (user) {
            console.log('Admin user already exists');
            user.role = 'admin'; // Ensure role is admin
            await user.save();
            console.log('Admin role ensured');
        } else {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            user = new User({
                name: 'Admin User',
                email,
                passwordHash,
                role: 'admin'
            });

            await user.save();
            console.log('Admin user created successfully');
        }

        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

createAdmin();

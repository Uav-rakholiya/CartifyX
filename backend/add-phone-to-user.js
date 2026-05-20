
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mix-ecommerce-db');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const User = mongoose.model('User', UserSchema);

const updateUser = async () => {
    await connectDB();
    try {
        const email = 'test2@example.com';
        const phone = '1234567890';

        let user = await User.findOne({ email });
        if (user) {
            user.phone = phone;
            await user.save();
            console.log(`Updated user ${email} with phone ${phone}`);
        } else {
            console.log(`User ${email} not found`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

updateUser();

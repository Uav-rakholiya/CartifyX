import mongoose from 'mongoose';

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('❌ MONGO_URI environment variable is not set. Exiting.');
        process.exit(1);
    }
    try {
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

const mongoose = require('mongoose');
require('dotenv').config();

// Define schema inline to avoid import issues
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number
});
const Product = mongoose.model('Product', productSchema);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cartifyx');
        console.log('MongoDB Connected');

        const products = await Product.find({ name: /iPhone/i }, 'name category');
        console.log(`Found ${products.length} iPhones:`);
        products.forEach(p => console.log(`[${p.category}] ${p.name}`));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();

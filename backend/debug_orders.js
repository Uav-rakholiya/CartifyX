
const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/MY/Angular Project/cartifyX/backend/.env' });

const OrderSchema = new mongoose.Schema({
    items: [{
        product: mongoose.Schema.Types.ObjectId,
        name: String,
        quantity: Number,
        price: Number
    }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { strict: false });

const Order = mongoose.model('Order', OrderSchema);

async function checkOrders() {
    try {
        await mongoose.connect('mongodb://localhost:27017/urbancart'); // Check urbancart
        console.log('Connected to DB: urbancart');

        const orders = await Order.find({}).limit(5);
        console.log('Sample Orders:', JSON.stringify(orders, null, 2));

        if (orders.length > 0) {
            const sampleProductId = orders[0].items[0].product;
            console.log('Sample Product ID from DB:', sampleProductId);

            const count = await Order.countDocuments({});
            console.log(`Total Orders in DB: ${count}`);

            if (count > 0) {
                const sample = await Order.findOne({});
                console.log('Sample Order:', JSON.stringify(sample, null, 2));
            }

            const match = await Order.find({ "items.product": sampleProductId });
            console.log(`Orders matching Product ID ${sampleProductId}:`, match.length);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkOrders();

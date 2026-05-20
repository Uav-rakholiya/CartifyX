const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Try explicit path relative to cwd
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const verifyNotifications = async () => {
    try {
        console.log('Loading .env from:', process.cwd());
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/urbancart';
        console.log('Connecting to MongoDB with URI:', uri);

        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // Define Schema
        const ContactSchema = new mongoose.Schema({
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, required: true },
            email: { type: String, required: true },
            subject: { type: String, required: true },
            message: { type: String, required: true },
            adminReply: { type: String },
            isReplyRead: { type: Boolean, default: false }
        }, { timestamps: true });

        // Use existing model or define
        const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

        const unreadReplies = await Contact.find({
            adminReply: { $exists: true, $ne: "" },
            isReplyRead: false
        });

        // Also list all contacts with admin replies just in case
        const allReplies = await Contact.find({
            adminReply: { $exists: true, $ne: "" }
        });

        // Count messages with NO userId
        const noUserMessages = await Contact.find({
            userId: { $eq: null }
        });

        const fs = require('fs');

        const result = {
            unreadReplies: unreadReplies.map(r => ({
                id: r._id,
                userId: r.userId,
                subject: r.subject,
                replyPreview: r.adminReply ? r.adminReply.substring(0, 50) : 'N/A'
            })),
            totalRepliesCount: allReplies.length,
            noUserMessagesCount: noUserMessages.length,
            envUriUsed: uri ? uri.substring(0, 20) + '...' : 'N/A'
        };

        fs.writeFileSync('notifications_dump.json', JSON.stringify(result, null, 2));
        console.log('Dumped to notifications_dump.json');


    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyNotifications();

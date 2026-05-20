import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contact from '../src/models/contact.model';

dotenv.config();

const verifyNotifications = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        const unreadReplies = await Contact.find({
            adminReply: { $exists: true, $ne: "" },
            isReplyRead: false
        });

        console.log(`Found ${unreadReplies.length} unread admin replies.`);
        unreadReplies.forEach(r => {
            console.log(`- ID: ${r._id}, UserID: ${r.userId}, Subject: ${r.subject}, Reply: ${r.adminReply?.substring(0, 20)}...`);
        });

        // Also list all contacts with admin replies just in case
        const allReplies = await Contact.find({
            adminReply: { $exists: true, $ne: "" }
        });
        console.log(`Total messages with replies: ${allReplies.length}`);


    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyNotifications();

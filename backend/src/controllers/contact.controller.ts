import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Contact from '../models/contact.model';
import sendEmail from '../utils/email';

// Extend Request interface to include user (if using custom middleware)
// For now we will cast req to any to access user or just take userId from body if sent
// Ideally, use a proper auth middleware interface

export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message, userId } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const newContact = new Contact({
            userId: userId || null, // Store userId if provided
            name,
            email,
            subject,
            message
        });
        await newContact.save();

        const { __v, ...contactData } = newContact.toObject();

        res.status(201).json({ success: true, message: 'Message sent successfully', data: contactData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

export const getAllMessages = async (req: Request, res: Response) => {
    try {
        const messages = await Contact.find().select('-__v').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

export const replyToMessage = async (req: Request, res: Response) => {
    try {
        const { email, subject, message, messageId } = req.body; // Expect messageId to update DB

        if (!email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'Email, subject and message are required' });
        }

        // 1. Send Email (Backend Console or SMTP)
        await sendEmail({
            email,
            subject: `Re: ${subject}`,
            message
        });

        // 2. Update the contact record with the reply
        if (messageId) {
            await Contact.findByIdAndUpdate(messageId, {
                adminReply: message,
                isReplyRead: false // Mark as unread for the user
            });
        } else {
            // Fallback: Try to find the latest message from this email with this subject if messageId not provided
            // This is less accurate but a fallback
            await Contact.findOneAndUpdate(
                { email, subject },
                { adminReply: message, isReplyRead: false },
                { sort: { createdAt: -1 } }
            );
        }

        res.status(200).json({ success: true, message: 'Reply sent successfully' });
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).json({ success: false, message: 'Failed to send reply', error });
    }
};

export const getUserNotifications = async (req: Request, res: Response) => {
    try {
        console.log('GET /notifications called');
        // Assume auth middleware puts user in req.user, or pass userId in params/query
        // For security, usually req.user.id from token.
        // Here we will accept userId as a query param for simplicity if not fully strict on auth middleware presence in routes yet
        const userId = req.query.userId as string;
        const email = req.query.email as string;

        console.log('Query Params:', { userId, email });

        if (!userId && !email) {
            return res.status(400).json({ success: false, message: 'User ID or Email required' });
        }

        const query: any = {
            adminReply: { $exists: true, $ne: "" }, // Has a reply
            isReplyRead: false // Is not read
        };

        if (userId) query.userId = new mongoose.Types.ObjectId(userId); // Ensure ObjectId conversion if needed
        else if (email) query.email = email;

        console.log('Mongo Query:', JSON.stringify(query));

        // Debug: Find specific document to see why it fails
        if (userId) {
            const userContacts = await Contact.find({ userId: userId });
            console.log(`DEBUG: Found ${userContacts.length} total messages for this user.`);
            userContacts.forEach(c => {
                console.log(`- Msg ID: ${c._id}, Reply: ${!!c.adminReply}, Read: ${c.isReplyRead}`);
            });
        }

        const notifications = await Contact.find(query).select('-__v').sort({ updatedAt: -1 });
        console.log('Found notifications:', notifications.length);

        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

export const markReplyAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Contact.findByIdAndUpdate(id, { isReplyRead: true });
        res.status(200).json({ success: true, message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

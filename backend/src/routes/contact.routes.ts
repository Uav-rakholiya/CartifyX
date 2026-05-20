import express from 'express';
import { submitContactForm, getAllMessages, replyToMessage, getUserNotifications, markReplyAsRead } from '../controllers/contact.controller';

const router = express.Router();
console.log('Loading contact.routes.ts');

// User route to get notifications (replies)
router.get('/notifications', getUserNotifications);

// User route to mark notification as read
router.put('/notifications/:id/read', markReplyAsRead);

// Public route to submit form
router.post('/', submitContactForm);

// Admin route to view messages
router.get('/', getAllMessages);

// Admin route to reply to messages
router.post('/reply', replyToMessage);

export default router;

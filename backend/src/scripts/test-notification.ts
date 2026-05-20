import axios from 'axios';
import mongoose from 'mongoose';

const API_URL = 'http://localhost:5000/api/v1/contact';
const TEST_USER_ID = new mongoose.Types.ObjectId().toString();

const testNotification = async () => {
    console.log(`Testing with User ID: ${TEST_USER_ID}`);

    try {
        // 1. Send a message as this user (Simulating Contact Form)
        console.log('1. Sending message...');
        const sendRes = await axios.post(`${API_URL}`, {
            userId: TEST_USER_ID,
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'Test Message'
        });
        const messageId = sendRes.data.data._id;
        console.log(`   Message Sent. ID: ${messageId}`);

        // 2. Reply as Admin (Simulating Admin Reply)
        console.log('2. Sending Admin Reply...');
        await axios.post(`${API_URL}/reply`, {
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'This is the admin reply',
            messageId: messageId
        });
        console.log('   Reply Sent.');

        // 3. Get Notifications (Simulating App Component check)
        console.log('3. Checking Notifications...');
        const notifRes = await axios.get(`${API_URL}/notifications`, {
            params: { userId: TEST_USER_ID }
        });

        console.log('   Notification Response:', notifRes.data);

        if (notifRes.data.data && notifRes.data.data.length > 0) {
            console.log('✅ SUCCESS: Notification found!');
        } else {
            console.log('❌ FAILURE: No notifications found.');
        }

    } catch (error: any) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
};

testNotification();

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/contact/reply';

const testReply = async () => {
    try {
        console.log(`Sending test reply to ${API_URL}...`);

        const testData = {
            email: 'testscript@example.com',
            subject: 'Test Subject',
            message: 'This is a test reply from the backend test script.'
        };

        const response = await axios.post(API_URL, testData);

        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);

        if (response.status === 200 && response.data.success) {
            console.log('✅ Email reply verification PASSED');
        } else {
            console.error('❌ Email reply verification FAILED');
        }

    } catch (error: any) {
        console.error('❌ Error testing email reply:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
};

testReply();

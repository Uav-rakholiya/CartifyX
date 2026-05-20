import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/contact';

const testContactSubmission = async () => {
    try {
        console.log(`Sending test message to ${API_URL}...`);

        const testData = {
            name: 'Test Script User',
            email: 'testscript@example.com',
            subject: 'Test Subject from Script',
            message: 'This is a test message sent from the backend test script to verify the API.'
        };

        const response = await axios.post(API_URL, testData);

        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);

        if (response.status === 201 && response.data.success) {
            console.log('✅ Contact form submission verification PASSED');
        } else {
            console.error('❌ Contact form submission verification FAILED');
        }

    } catch (error: any) {
        console.error('❌ Error testing contact submission:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
};

testContactSubmission();

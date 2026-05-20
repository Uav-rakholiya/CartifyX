import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

const debugBackend = async () => {
    console.log('🔍 Debugging Backend Routes...');

    try {
        // 1. Check Health (if exists) or just root
        try {
            console.log(`Checking GET ${BASE_URL}/health...`);
            // Assuming health check might be at /health or /api/health not /api/v1/health based on app.ts
            // app.get('/health') is at root
            const healthRes = await axios.get('http://localhost:5000/health');
            console.log(`✅ /health Status: ${healthRes.status}`);
        } catch (e: any) {
            console.log(`❌ /health Failed: ${e.message}`);
        }

        // 2. Check GET /api/v1/contact
        try {
            console.log(`Checking GET ${BASE_URL}/contact...`);
            const contactRes = await axios.get(`${BASE_URL}/contact`);
            console.log(`✅ GET /contact Status: ${contactRes.status}`);
            console.log('headers:', contactRes.headers['x-powered-by']);
        } catch (e: any) {
            console.log(`❌ GET /contact Failed: ${e.message} (Status: ${e.response?.status})`);
        }

        // 3. Check POST /api/v1/contact/reply
        try {
            console.log(`Checking POST ${BASE_URL}/contact/reply...`);
            const replyRes = await axios.post(`${BASE_URL}/contact/reply`, {
                email: 'test@example.com',
                subject: 'Test',
                message: 'Test'
            });
            console.log(`✅ POST /contact/reply Status: ${replyRes.status}`);
        } catch (e: any) {
             console.log(`❌ POST /contact/reply Failed: ${e.message}`);
             if (e.response) {
                 console.log(`   Status: ${e.response.status}`);
                 console.log(`   Data:`, JSON.stringify(e.response.data));
             }
        }

    } catch (error: any) {
        console.error('Fatal Error:', error);
    }
};

debugBackend();

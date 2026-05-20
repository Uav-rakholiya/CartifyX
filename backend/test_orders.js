
const http = require('http');

function fetchAllOrders() {
    console.log(`Fetching all orders...`);
    const options = {
        hostname: 'localhost',
        port: 5003,
        path: `/api/v1/orders`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            // Auth might be required here if adminMiddleware is active
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log('Order Count:', json.data ? json.data.length : 'No data field');
                if (json.data && json.data.length > 0) {
                    console.log('First Order ID:', json.data[0]._id);
                } else {
                    console.log('Body:', data.substring(0, 200));
                }
            } catch (e) {
                console.log('Body:', data.substring(0, 200));
            }
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.end();
}

fetchAllOrders();

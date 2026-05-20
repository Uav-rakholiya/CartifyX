
const http = require('http');

const productId = '6988ac9ff23c7c1ed6263432'; // From user screenshot URL
// Or use one from my debug script: 69889f12a01c099714602ca7
const productId2 = '69889f12a01c099714602ca7';

function fetchOrders(id) {
    console.log(`Fetching orders for product: ${id}`);
    const options = {
        hostname: 'localhost',
        port: 5003,
        path: `/api/v1/orders/product/${id}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            // Add auth token if needed, but adminMiddleware might block it.
            // I need a token!
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('BODY:', data.substring(0, 500)); // First 500 chars
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${JSON.stringify(e)} ${e.message}`);
    });

    req.end();
}

// Fetch for both IDs
fetchOrders(productId);
// fetchOrders(productId2);

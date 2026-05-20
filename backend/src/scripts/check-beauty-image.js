const https = require('https');
const url = require('url');

const beautyUrl = 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=500&q=80';

const checkUrl = (imageUrl) => {
    return new Promise((resolve) => {
        const opts = url.parse(imageUrl);
        opts.method = 'HEAD';

        const req = https.request(opts, (res) => {
            console.log(`[${res.statusCode}] Beauty Image`);
            if (res.statusCode !== 200) {
                console.log(`   FAIL: ${imageUrl}`);
            }
            resolve();
        });

        req.on('error', (e) => {
            console.log(`[ERROR]: ${e.message}`);
            resolve();
        });

        req.end();
    });
};

checkUrl(beautyUrl);

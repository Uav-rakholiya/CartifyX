const https = require('https');
const url = require('url');

const candidates = [
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&q=80',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80',
    'https://images.unsplash.com/photo-1522337360705-8b13d52303fa?w=500&q=80',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&q=80'
];

const checkUrl = (imageUrl) => {
    return new Promise((resolve) => {
        const opts = url.parse(imageUrl);
        opts.method = 'HEAD';

        const req = https.request(opts, (res) => {
            if (res.statusCode === 200) {
                console.log(`[PASS] ${imageUrl}`);
                resolve(true);
            } else {
                console.log(`[FAIL ${res.statusCode}] ${imageUrl}`);
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log(`[ERROR] ${e.message}`);
            resolve(false);
        });

        req.end();
    });
};

const run = async () => {
    for (const img of candidates) {
        const works = await checkUrl(img);
        if (works) process.exit(0);
    }
    console.log('No working images found');
    process.exit(1);
};

run();

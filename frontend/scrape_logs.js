const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        let errors = [];

        page.on('console', msg => {
            if (msg.type() === 'error' || msg.type() === 'warning') {
                errors.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
            }
        });

        page.on('pageerror', error => {
            errors.push(`[UNCAUGHT ERROR] ${error.message}`);
        });

        page.on('requestfailed', request => {
            const url = request.url();
            // Skip tracking pixels or common ad blockers if needed, but here we just collect all
            if (url.includes('localhost') || url.includes('api')) {
                errors.push(`[NETWORK ERROR] ${url} - ${request.failure()?.errorText}`);
            }
        });

        console.log('Navigating to http://localhost:4200/products ...');
        await page.goto('http://localhost:4200/products', { waitUntil: 'networkidle2' });

        // Wait a bit more for any trailing errors
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('\n--- Captured Browser Console Logs ---');
        if (errors.length === 0) {
            console.log('No errors or warnings found!');
        } else {
            errors.forEach(err => console.log(err));
        }
        console.log('-------------------------------------\n');

        await browser.close();
    } catch (err) {
        console.error('Failed to run puppeteer:', err);
    }
})();

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        let logs = [];

        page.on('console', msg => {
            if (msg.type() === 'error' || msg.type() === 'warning') {
                logs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
            }
        });

        page.on('pageerror', error => {
            logs.push(`[UNCAUGHT ERROR] ${error.message}`);
        });

        page.on('requestfailed', request => {
            const url = request.url();
            if (url.includes('localhost') || url.includes('api')) {
                logs.push(`[NETWORK ERROR] ${url} - ${request.failure()?.errorText}`);
            }
        });

        await page.goto('http://localhost:4200/products', { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 3000));

        fs.writeFileSync('browser_logs.json', JSON.stringify(logs, null, 2));
        console.log('Logs saved to browser_logs.json');

        await browser.close();
    } catch (err) {
        console.error('Failed to run puppeteer:', err);
    }
})();

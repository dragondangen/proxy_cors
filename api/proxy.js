const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url } = req.query;
    if (!url) {
        return res.status(400).send('Missing url parameter');
    }

    let browser = null;
    try {
        const executablePath = await chromium.executablePath();
        
        browser = await puppeteer.launch({
            args: [...chromium.args, '--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1280, height: 800 },
            executablePath: executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });
        const html = await page.content();
        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.toString());
    } finally {
        if (browser) await browser.close();
    }
};
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    let dumb = ['https://x-api.snowballfinance.info/harvest', 'https://x-api.snowballfinance.info/harvest.json'];

    for (var x = 0; x < dumb.length; x++) {
        // 
        const page = await browser.newPage()
        await browser.newPage()
        page.goto(dumb[x]);
    }
    fs.writeFileSync('public/harvest.json', JSON.stringify({}, null, 2))
    await browser.close();
})()

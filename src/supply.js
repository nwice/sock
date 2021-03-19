const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {

    let supply = {
      total: 18000000
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.goto('https://cchain.explorer.avax.network/tokens/0xC38f41A296A4493Ff429F1238e030924A1542e50/token-transfers');    
    await delay(2000)
    const circulating = await page.evaluate(() => {            
        let l = 0;
        [].forEach.call(document.querySelectorAll('h2'), function (h2) {
            if (h2.innerHTML === 'Total Supply') {
                l = h2.nextElementSibling.firstElementChild.innerHTML.replace(/[^0-9.]/g, '');
            }
        })
        return l
    })
    supply.circulating = parseFloat(circulating)
    console.log('supply:', supply)
    fs.writeFileSync('public/supply.json', JSON.stringify(supply, null, 2))
    await browser.close();
})()

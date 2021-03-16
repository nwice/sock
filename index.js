const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

let info = [
    { pair: 'avax_sushi', tvl: 0, account: '0x14ec55f8B4642111A5aF4f5ddc56B7bE867eB6cC' },
    { pair: 'avax_snob', tvl: 0, account: '0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375' },
    { pair: 'avax_png', tvl: 0, account: '0x1eC206a9dD85625E1940cD2B0c8e14a894D2e9aC' },
    { pair: 'avax_eth', tvl: 0, account: '0x953853590b805A0E885A75A3C786D2aFfcEEA3Cf' },
    { pair: 'avax_link', tvl: 0, account: '0x974Ef0bDA58C81F3094e124f530eF34fe70dc103' }
];

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()

    for (let x = 0; x < info.length; x++) {
        let p = 'https://info.pangolin.exchange/#/account/' + info[x].account;
        console.log('page:', p)
        await page.goto(p)
        await delay(5000);
        const liquidity = await page.evaluate(() => {
            let l = 0;
            [].forEach.call(document.querySelectorAll('div'), function (div) {
                if (div.innerHTML === 'Liquidity (Including Fees)') {
                    l = div.parentNode.nextElementSibling.firstElementChild.innerHTML;
                }
            });
            return l
        });
        info[x].tvl = parseFloat(liquidity.replace(/[^0-9.-]+/g, ''))
        console.log('pair:', info[x].pair, 'liquidity:', info[x].tvl)
    };
    await browser.close()
    let t = info.map(p => { return p.tvl }).reduce((a, b) => a + b)
    console.log('total:', t)
    fs.writeFileSync('info.json', JSON.stringify(info));
})()
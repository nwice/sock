const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

let avax = { symbol: 'avax', token: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7' };
let link = { symbol: 'link', token: '0xb3fe5374f67d7a22886a0ee082b2e2f9d2651651' }
let eth = { symbol: 'eth', token: '0xf20d962a6c8f70c731bd838a3a388d7d48fa6e15'}
let png = { symbol: 'png', token: '0x60781c2586d68229fde47564546784ab3faca982'}
let snob = { symbol: 'snob', token: '0xc38f41a296a4493ff429f1238e030924a1542e50'}
let sushi = { symbol: 'sushi', token: '0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc'}

let info = { pairs: [
    { 
        token0: avax, token1: link, 
        account: '0x974Ef0bDA58C81F3094e124f530eF34fe70dc103' },    
    {   
        token0: avax, token1: eth, 
        account: '0x953853590b805A0E885A75A3C786D2aFfcEEA3Cf' },
    { 
        token0: avax, token1: png, 
        account: '0x1eC206a9dD85625E1940cD2B0c8e14a894D2e9aC' 
    },
    { 
        token0: avax, token1: snob,
        account: '0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375' },
    { 
        token0: avax,  token1: sushi, 
        account: '0x14ec55f8B4642111A5aF4f5ddc56B7bE867eB6cC' 
    }    
], locked_value: 0};

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    for (let x = 0; x < info.pairs.length; x++) {
        let pair = info.pairs[x]
        pair.account = pair.account.toLowerCase()
        pair.token0.token = pair.token0.token.toLowerCase()
        pair.token1.token = pair.token1.token.toLowerCase();
        await page.goto('https://info.pangolin.exchange/#/account/' + pair.account)
        await delay(5000);
        const liquidity = await page.evaluate(() => {            
            let l = 0;
            [].forEach.call(document.querySelectorAll('div'), function (div) {
                if (div.innerHTML === 'Liquidity (Including Fees)') {
                    l = div.parentNode.nextElementSibling.firstElementChild.innerHTML
                }
            })
            return l
        })
        try {
            pair.locked_value = parseFloat(liquidity.replace(/[^0-9.-]+/g, ''))
            if ( isNaN(pair.locked_value) ) {
                x = x - 1
                console.log('again!')
            } else {
                console.log('pair:', pair.token1.symbol, 'liquidity:', pair.locked_value)
            }    
        } catch (err) {
            x = x - 1
            console.log('again:', err)
        }
    }
    await browser.close();
    info.date = new Date().toISOString();
    info.locked_value = info.pairs.map(p => { return p.locked_value }).reduce((a, b) => a + b)
    console.log('total:', '$' + info.locked_value.toFixed(2))
    fs.writeFileSync('public/pairs.json', JSON.stringify(info, null, 2))
})()

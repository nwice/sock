const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

const pricing = []
function getprice(symbol) {
    pricing.filter(p => { return p.symbol == symbol})
}

(async () => {

    const width = 1920
    const height = 1080
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', `--window-size=${ width },${ height }`],
    })
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage()
    await page.setViewport({ width: 1920, height: 1080});
    await page.goto('https://info.pangolin.exchange/#/tokens', { waitUntil: 'domcontentloaded' });
    let stopped = false;
    while(!stopped) {
        await delay(2000);
        try {
            const wavax_div = await page.evaluate(() => {  
                let divs = document.querySelectorAll('div');
                let f = null;
                [].forEach.call(divs, function (div) {
                    if (div.innerHTML === 'Symbol ') {
                        [].forEach.call(div.parentNode.parentNode.nextElementSibling.nextElementSibling.children, function(child) {
                            let inner_divs = child.firstChild.querySelectorAll(":scope > div"); 
                            console.log('2:', inner_divs[1].innerHTML)
                        });
                        //f = d.innerHTML
                    }
                    console.log('')
                });
                return f;
            })
            console.log('wavax div:', wavax_div)
        } catch (err) {
            console.log('error:', err)    
        }                    
    }

    /*
    for (let x = 0; x < info.pairs.length; x++) {
        let pair = info.pairs[x]
        pair.account = pair.account.toLowerCase()
        pair.token0.token = pair.token0.token.toLowerCase()
        pair.token1.token = pair.token1.token.toLowerCase();
        
        await delay(5000);
        const liquidity = await page.evaluate(() => {            
            let l = 0;

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
    
    info.date = new Date().toISOString();
    info.locked_value = info.pairs.map(p => { return p.locked_value }).reduce((a, b) => a + b)
    console.log('total:', '$' + info.locked_value.toFixed(2))
    fs.writeFileSync('public/pairs.json', JSON.stringify(info, null, 2))
    */
    await browser.close();
})()

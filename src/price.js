const puppeteer = require('puppeteer');
const WebSocket = require('ws');

var AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

let table = 'price'

let long_dive = true;

console.log('price service:', long_dive)

let specific_dex = {
    value: 0, 
    token: 'PNG',
    info: {
        tokens: 'https://info.pangolin.exchange/#/tokens',
        match_inner_html: 'WAVAX'
    }
}

const server = new WebSocket.Server({
  port: 8081
});

server.on('connection', function connection(ws) {
    ws.on('message', (message) => {
        try {
            let msg = JSON.parse(message);
            //console.log('price change:', msg)
            ddb.putItem({
                TableName: 'price',
                Item: AWS.DynamoDB.Converter.marshall(msg)
            }, function (err, data) {
                if (err) {
                   console.log('put error:');
                } else {
                    console.log('put success:', data);
                }
            });             
        } catch (err) {
            console.log('text:', message)
        }
    });
    ws.on('close', (event) => {
        console.log('close:', event);
    });
    ws.on('open', (event) => {
        console.log('open:', event);
    });             
});

(async () => {

    const width = 1920
    const height = 1080
    const browser = await puppeteer.launch({
        headless: true,
        userDataDir: '/tmp/user-data-dir-' + Math.floor((Math.random() * 10000000000) + 1),
        args: ['--no-sandbox', '--disable-setuid-sandbox', `--window-size=${ width },${ height }`],
    })
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage()
    page.on('request', request => {
        if ( 
            request.url().indexOf('raw.githubusercontent.com') < 0 && 
            request.url().indexOf('graph-node.avax.network') < 0 &&
            request.url().indexOf('unpkg.com') < 0 &&
            request.url().indexOf('data:image/png;base64') < 0 ) {
            console.log('request:', request.url());
        }
    });
    await page.setViewport({ width: 1920, height: 1080});
    const session = await page.target().createCDPSession();
    await session.send("Page.enable");
    await session.send("Page.setWebLifecycleState", { state: "active" });

    await page.goto(specific_dex.info.tokens, { waitUntil: 'domcontentloaded' });
    console.log('diver - step off')
    await page.evaluate((dex) => {

        document.dex = dex;

        return new Promise ((resolve, reject) => {
            const client = new WebSocket('ws://localhost:8081');
            
            document.addEventListener('price', function (e) {
                //client.send(JSON.stringify(e.detail))

                let rank = e.detail.querySelector(':scope > div > div > div').innerHTML
                let hash = e.detail.querySelector(':scope > div > div > a').href.split('/').pop();
                let token = e.detail.querySelector(':scope > div:nth-of-type(2) > div').innerHTML
                let liquidity = e.detail.querySelector(':scope > div:nth-of-type(3)').innerHTML.replace(/[^\d.-]/g, '')
                let volume = e.detail.querySelector(':scope > div:nth-of-type(4)').innerHTML.replace(/[^\d.-]/g, '')
                let price = e.detail.querySelector(':scope > div:nth-of-type(5)').innerHTML.replace(/[^\d.-]/g, '')
                let change = e.detail.querySelector(':scope > div:nth-of-type(6) > div').innerHTML
                let obj = { rank, hash, token, liquidity, volume, price, change, timestamp: new Date().getTime() }

                if ( parseInt(rank) < 12) {
                    client.send('token:' + JSON.stringify(obj));
                }
                //client.send(JSON.stringify(obj))

            }, false);

            document.addEventListener('chat', function (e) {
                client.send(e.detail)
            }, false);

            document.addEventListener('watchtoken', function (e) {
                const observer = new MutationObserver((mutationsList, observer) => {
                    client.send('mutation change')
                });
                observer.observe(e.detail, { attributes: true, childList: true, subtree: true });
            }, false);

            document.addEventListener('foundking', (e) => {
                // need to iterate through div
                // mutation observer not working...yet.
                // 
                let king = e.detail;
                let throne = king.parentNode.parentNode;
                let tokens = [...throne.parentNode.parentNode.querySelectorAll(':scope > div > div:nth-of-type(1)')];
                tokens.forEach(t=> {
                    document.dispatchEvent(new CustomEvent('price', {
                        detail: t
                    }));
                })
                setInterval( () => { 
                    // may comfirm pair liquidity -- maybe that trips price updates

                }, 30000);

            });

            client.addEventListener('open', function (event) {
                client.send(`open ${dex.token} to ${document}`);
                resolve()
            });

            client.addEventListener('close', function (event) {
                client.send(`close ${dex.token} to ${document}`);
                reject()
            });             
        });     
    }, specific_dex);
    let submerged = 500;
    
    await page.waitForFunction(`document.querySelectorAll('div').length > ${submerged}`);

    let submerged_divs = await page.evaluate(() => {
        return Promise.resolve(document.querySelectorAll('div').length)
    });
    console.log('submerged divs:', submerged_divs)  
    if (long_dive) {
        console.log('long dive good luck');
        await page.evaluate(() => {
            return new Promise ((resolve, reject) => {
                let all_divs = document.querySelectorAll('div');
                document.dispatchEvent(new CustomEvent('chat', {
                    detail: 'landed:' + all_divs.length
                }));
                let king_div = null;
                [].forEach.call(all_divs, (div) => {
                    if ( div.innerHTML === document.dex.info.match_inner_html ) {
                        king_div = div                        
                    }
                });
                if (king_div != null) {
                    document.dispatchEvent(new CustomEvent('foundking', {
                        detail: king_div
                    }));
                }
            });
        });
    }
    console.log('before close - assuming task complete');
    await browser.close();
})()

const puppeteer = require('puppeteer');
const WebSocket = require('ws');
const fs = require('fs');
const AWS = require('aws-sdk');
const { exit } = require('process');

AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const dynamo_client = new AWS.DynamoDB.DocumentClient();

console.log('price service')

const table = 'price'

setTimeout( () => {
    console.log('well done')
    exit()
}, 30 * 1000)

const dexes = [{
    value: 0, 
    token: 'PNG',
    info: {
        tokens: 'https://info.pangolin.exchange/#/tokens',
        match_inner_html: 'WAVAX'
    }
},{
    value: 0, 
    token: 'ELK',
    info: {
        tokens: 'https://avax-info.elk.finance/#/tokens',
        match_inner_html: 'ELK'
    }
}];

const run_dex = dexes[0];

const server = new WebSocket.Server({ port: 8081 });

const current_prices = [];
function get_current_price(msg) {
    try {
        return current_prices.filter(cp => { return cp.token == msg.token && cp.dex == msg.dex })[0]
    } catch (err) {
        current_prices.push(msg)
    }
}

const publish = (msg, update, previous) => {
    if ( update ) {
        ddb.putItem({
            TableName: table,
            Item: AWS.DynamoDB.Converter.marshall(msg)
        }, (err, data) => {
            if (err) {
                console.log('put error:', err);
            }
        });        
        let content = JSON.stringify(Object.assign(msg, previous ? { previous } : {}), null, 2);
        let path = `price/${msg.token}.json`.toLowerCase();
            
        fs.writeFileSync('public/' + path.toLowerCase(), content)
            
        s3.upload({
            Bucket: 'beta.scewpt.com',
            Key: path, // File name you want to save as in S3
            Body: content,
            ContentType: 'application/json',
            ACL: 'public-read'
        }, (err, data) => {
            if (err) {
                throw err;
            }
        });        
    }
}

server.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            let msg = JSON.parse(message);        
            let current_price = get_current_price(msg)
            if ( current_price !== undefined && current_price.price != msg.price ) {
                return
            }
            dynamo_client.query({
                TableName : 'price',
                Select: 'ALL_ATTRIBUTES',
                Limit: 1,
                ScanIndexForward: false,
                KeyConditionExpression: '#token = :token',
                ExpressionAttributeValues: {
                    ':token': msg.token
                },
                ExpressionAttributeNames: {
                    '#token': 'token'
                }    
            }, (err, data) => {                                
                if (err) {
                    console.log('token query error:', JSON.stringify(err, null, 2));                    
                } else if ( data.Items.length > 0 && data.Items[0].price == msg.price ) {
                    console.log('ignore:', msg.token, 'price:', msg.price)                    
                    publish(msg, false, data.Items[0])
                } else {
                    console.log('publish:', msg.token, 'price:', msg.price, 'previous:', new Date(data.Items[0].timestamp).toLocaleDateString()) 
                    publish(msg, true, data.Items.length > 0 ? data.Items[0] : null )
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
    await page.setViewport({ width: 1920, height: 1080});
    const session = await page.target().createCDPSession();
    await session.send("Page.enable");
    await session.send("Page.setWebLifecycleState", { state: "active" });

    await page.goto(run_dex.info.tokens, { waitUntil: 'domcontentloaded' });
    console.log('diver - step off')
    await page.evaluate((script_dex) => {

        document.findking = () => {
            let all_divs = document.querySelectorAll('div');
            let king_div = null;
            [].forEach.call(all_divs, (div) => {
                if ( div.innerHTML === script_dex.info.match_inner_html ) {
                    king_div = div                        
                }
            });
            return king_div;
        }       
        
        document.get_tokens_array = () => {
            return [...document.findking().parentNode.parentNode.parentNode.parentNode.querySelectorAll(':scope > div > div:nth-of-type(1)')];
        }

        return new Promise ((resolve) => {
            const ws_client = new WebSocket('ws://localhost:8081');
            
            document.addEventListener('send', (e) => {
                ws_client.send(e.detail)
            }, false);

            document.addEventListener('watchtoken', (e) => {
                const observer = new MutationObserver((mutationsList, observer) => {
                    ws_client.send('mutation change')
                });
                observer.observe(e.detail, { attributes: true, childList: true, subtree: true });
            }, false);

            ws_client.addEventListener('open', (event) => {
                ws_client.send(`open ${script_dex.token} to ${document}`);
                resolve()
            }); 
            
        });     
    }, run_dex);
    let submerged = 500;
    
    await page.waitForFunction(`document.querySelectorAll('div').length > ${submerged}`);
    let submerged_divs = await page.evaluate(() => {
        return Promise.resolve(document.querySelectorAll('div').length)
    });
    console.log('submerged divs:', submerged_divs)  
    console.log('long dive good luck');
    await page.evaluate((script_dex) => {

        const outbound = (msg) => {
            document.dispatchEvent(new CustomEvent('send', {
                detail: msg
            }))
        }

        const process = () => {
            document.get_tokens_array().forEach( (t) => {      
                let rank = parseInt(t.querySelector(':scope > div > div > div').innerHTML)
                let hash = t.querySelector(':scope > div > div > a').href.split('/').pop();
                let token = t.querySelector(':scope > div:nth-of-type(2) > div').innerHTML
                if ( hash === '0x64ea9156199161b0c54825c2f117cd71dbde859c' ) {
                    token = 'BAMBOO'
                }
                if ( token === 'WAVAX' ) {
                    token = 'AVAX'
                }                
                let liquidity = parseFloat(t.querySelector(':scope > div:nth-of-type(3)').innerHTML.replace(/[^\d.-]/g, ''))
                let volume = parseFloat(t.querySelector(':scope > div:nth-of-type(4)').innerHTML.replace(/[^\d.-]/g, ''))
                let price = parseFloat(t.querySelector(':scope > div:nth-of-type(5)').innerHTML.replace(/[^\d.-]/g, ''))
                let change = t.querySelector(':scope > div:nth-of-type(6) > div').innerHTML                
                let dex = script_dex.token
                let obj = { dex, rank, price, hash, token, liquidity, volume, price, change, timestamp: new Date().getTime() }
                if ( obj.price > 0 ) {
                    outbound(JSON.stringify(obj))
                }
            });            
        }

        return new Promise ((resolve, reject) => {
            let all_divs = document.querySelectorAll('div');
            outbound('landed:' + all_divs.length);  
            outbound('token set size: ' + document.get_tokens_array().length);
            process()
        });
    }, run_dex);
})()

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

const killswitch = setTimeout( () => {
    console.log('well done')
    exit()
}, 119 * 1000)

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

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
                    let p = null
                    if ( data.Items.length > 0 ) {
                        p = data.Items[0]
                    }
                    console.log('publish:', msg.token, 'price:', msg.price, 'previous:', p ? new Date(p.timestamp).toLocaleDateString() : null)
                    publish(msg, true, p )
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
                if ( div.innerHTML === "Liquidity ↓" ) {
                    king_div = div.parentNode.parentNode.nextElementSibling.nextElementSibling
                }
            });
            return king_div;
        }       
        
        document.get_tokens_array = () => {
            return [...document.findking().querySelectorAll(':scope > div > div:nth-of-type(1)')];
        }

        document.get_next_page = () => {
            let np = null;
            [...document.querySelectorAll('div')].forEach(d => {
                if ( d.innerHTML.startsWith('Page ') && d.innerHTML.indexOf(' of ') > -1 && d.innerHTML.split(' ')[1] != d.innerHTML.split(' ')[3] ) {
                    np = d;
                }
            });            
            return np;
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
    
    await page.waitForFunction(`document.querySelectorAll('div').length > ${submerged}`, { timeout: 0});
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
            outbound('sizing:' + document.get_tokens_array().length);
            document.get_tokens_array().forEach( (t) => {      
                let rank = parseInt(t.querySelector(':scope > div > div > div').innerHTML)
                let hash = t.querySelector(':scope > div > div > a').href.split('/').pop();
                let token = t.querySelector(':scope > div:nth-of-type(2) > div').innerHTML
                if ( hash === '0x0362d330f94fae853d5c462e57357f7ef7c2ea1d' || hash === '0x212ae83a676d3cc71ee111fdaa7aa0b0cd63001c' ) {
                    token = '__'
                } else if ( hash === '0xef4988cbe89316fa12650dcc036be2b242895306' ) {
                    token = 'BAMBOO'
                } else if ( token === 'WAVAX' ) {
                    token = 'AVAX'
                }                
                let liquidity = parseFloat(t.querySelector(':scope > div:nth-of-type(3)').innerHTML.replace(/[^\d.-]/g, ''))
                let volume = parseFloat(t.querySelector(':scope > div:nth-of-type(4)').innerHTML.replace(/[^\d.-]/g, ''))
                let price = parseFloat(t.querySelector(':scope > div:nth-of-type(5)').innerHTML.replace(/[^\d.-]/g, ''))
                let change = t.querySelector(':scope > div:nth-of-type(6) > div').innerHTML                
                let dex = script_dex.token
                let obj = { dex, rank, price, hash, token, liquidity, volume, price, change, timestamp: new Date().getTime() }
                if ( obj.price > 0 && token != '__' ) {
                    outbound(JSON.stringify(obj))
                } else {
                    outbound('skipping:' + token)
                }
            });  
            setTimeout( () => { 
                checkcomplete();          
            }, 2000);             
            
        }

        const checkcomplete = () => {
            let np = document.get_next_page();   
            outbound('np:' + np);        
            if ( np ) {
                np.nextElementSibling.click();
                setTimeout( () => { 
                    process()
                }, 2000);    
            } else {
                outbound('done');
            }
        }

        return new Promise ((resolve, reject) => {
            let all_divs = document.querySelectorAll('div');
            outbound('landed:' + all_divs.length);  
            outbound('token set size: ' + document.get_tokens_array().length);
            process()
        });
    }, run_dex);
})()

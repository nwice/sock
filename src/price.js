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

const master_skip_hash = ['0xa40903b205881e4a4da16121e2625d3997c4322d', '0x0362d330f94fae853d5c462e57357f7ef7c2ea1d', '0x212ae83a676d3cc71ee111fdaa7aa0b0cd63001c', '0x64ea9156199161b0c54825c2f117cd71dbde859c'];

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
        return current_prices.filter(cp => { return cp.token == msg.token && cp.hash == msg.hash && cp.dex == msg.dex })[0]
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

        let increment_type = 'price';
        let increment_token = msg.token.toLowerCase();
        let increment_out = content;

        let s3object = {        
            Key:`${increment_type}/${increment_token}.json`,
            Bucket: 'beta.scewpt.com',        
        }

        s3.headObject(s3object).promise().then(redirect => {
            console.log('redirect', redirect)
            let nv = 0
            try {
                nv = parseInt(redirect.WebsiteRedirectLocation.split('/').pop().split('.')[0]) + 1
                if ( isNaN(nv) ) {
                    nv = 0
                }
            } catch (err) {
                console.log('going with zero')
            }
             
            let next_version_location = `${increment_type}/${increment_token}/${nv}.json`
        
            console.log('new version:', nv)
            console.log('new version location:', next_version_location)
            
            s3.upload(Object.assign({}, s3object, {        
                ACL: 'public-read',
                Body: increment_out,
                ContentType: 'application/json',
                WebsiteRedirectLocation: '/' + next_version_location        
            })).promise();    
        
            s3.upload({    
                Bucket: 'beta.scewpt.com',    
                Key: next_version_location,
                Body: increment_out,
                ContentType: 'application/json',
                ACL: 'public-read'
            }).promise(); 
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
                FilterExpression: "#hash = :hash",
                ExpressionAttributeValues: {
                    ':token': msg.token,
                    ':hash': msg.hash
                },
                ExpressionAttributeNames: {
                    '#token': 'token',
                    '#hash': 'hash'
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
    await page.evaluate((script_dex, skip_hash) => {

        const outbound = (msg) => {
            document.dispatchEvent(new CustomEvent('send', {
                detail: msg
            }))
        }

        const process = () => {
            outbound('sizing:' + document.get_tokens_array().length);
            document.get_tokens_array().forEach( (t) => {      
                let skip = false
                let rank = parseInt(t.querySelector(':scope > div > div > div').innerHTML)
                let hash = t.querySelector(':scope > div > div > a').href.split('/').pop();
                let token = t.querySelector(':scope > div:nth-of-type(2) > div').innerHTML
                if ( skip_hash.indexOf(hash) > -1 ) {
                    skip = true
                } else if ( hash === '0x9a928d7dcd8d7e5cb6860b7768ec2d87b8934267') {
                    token = 'BAMBOO-V2'
                } else if ( hash === '0xef4988cbe89316fa12650dcc036be2b242895306' ) { 
                    token = 'BAMBOO'
                } else if ( token === 'WAVAX' ) {
                    token = 'AVAX'
                } else if ( token.startsWith('<div') ) {
                    skip = true                    
                }            
                let liquidity = parseFloat(t.querySelector(':scope > div:nth-of-type(3)').innerHTML.replace(/[^\d.-]/g, ''))
                let volume = parseFloat(t.querySelector(':scope > div:nth-of-type(4)').innerHTML.replace(/[^\d.-]/g, ''))
                let price = parseFloat(t.querySelector(':scope > div:nth-of-type(5)').innerHTML.replace(/[^\d.-]/g, ''))
                let change = t.querySelector(':scope > div:nth-of-type(6) > div').innerHTML                
                let dex = script_dex.token
                let obj = { dex, rank, price, hash, token, liquidity, volume, price, change, timestamp: new Date().getTime() }
                if ( !skip ) {
                    outbound(JSON.stringify(obj))
                } else {
                    outbound('skipping:' + token + ' hash:' + hash)
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
    }, run_dex, master_skip_hash);
})()

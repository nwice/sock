const puppeteer = require('puppeteer');
const fs = require('fs');

var AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var client = new AWS.DynamoDB.DocumentClient();

let table = 'tvl'

var scan_params = {
    TableName : table,
    Select: 'ALL_ATTRIBUTES',
    Limit: 1
};

let previous_item = {}

let king = {
    account: '0x5df42ace37bA4AceB1f3465Aad9bbAcaA238D652'.toLowerCase()
}

function onScan(err, data) {
    if (err) {
        console.log('scan error:', JSON.stringify(err, null, 2));
    } else {
        console.log('table:', table, 'items length:', data.Items.length)
        data.Items.forEach(function(item) {
            previous_item = item
            console.log('previous item:', new Date(previous_item.timestamp).toLocaleTimeString());
        }); 
        // normally need to check scan for more items
    }
}

client.scan(scan_params, onScan);

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

let avax = { token: 'avax', hash: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7' };
let link = { token: 'link', hash: '0xb3fe5374f67d7a22886a0ee082b2e2f9d2651651' }
let eth = { token: 'eth', hash: '0xf20d962a6c8f70c731bd838a3a388d7d48fa6e15'}
let png = { token: 'png', hash: '0x60781c2586d68229fde47564546784ab3faca982'}
let snob = { token: 'snob', hash: '0xc38f41a296a4493ff429f1238e030924a1542e50'}
let sushi = { token: 'sushi', hash: '0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc'}
let usdt = { token: 'usdt', hash: '0xde3a24028580884448a5397872046a019649b084'}

let info = { pairs: [
    { 
        token0: avax, token1: usdt, 
        account: '0x74db28797957a52a28963f424daf2b10226ba04c' },        
    { 
        token0: avax, token1: link, 
        account: '0x974Ef0bDA58C81F3094e124f530eF34fe70dc103' },    
    {   
        token0: avax, token1: eth, 
        account: '0x953853590b805A0E885A75A3C786D2aFfcEEA3Cf' },
    { 
        token0: avax, token1: png, 
        account: '0x6a803904b9ea0fc982fbb077c7243c244ae05a2d' 
    },
    { 
        token0: avax, token1: snob,
        account: '0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375' },
    { 
        token0: avax,  token1: sushi, 
        account: '0x14ec55f8B4642111A5aF4f5ddc56B7bE867eB6cC' 
    }    
], locked: 0};

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
        pair.token0.price = 0
        pair.token1.token = pair.token1.token.toLowerCase()
        pair.token1.price = 0
        await page.goto('https://info.pangolin.exchange/#/account/' + pair.account)
        await delay(20000);
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
            pair.locked = parseFloat(liquidity.replace(/[^0-9.-]+/g, ''))
            if ( isNaN(pair.locked) ) {
                x = x - 1
                console.log('again!')
            } else {
                console.log('pair:', [pair.token0.token, pair.token1.token].join('-'), 'liquidity:', pair.locked)
            }    
        } catch (err) {
            x = x - 1
            console.log('again:', err)
        }
    }

    info.timestamp = new Date().getTime();
    info.locked = info.pairs.map(p => { return p.locked }).reduce((a, b) => a + b)
    info.token = 'snob'
    info.price = 0
    info.hash = '0xc38f41a296a4493ff429f1238e030924a1542e50wsta'

    var item = AWS.DynamoDB.Converter.marshall(info);
    
    console.log('item:', item);

    console.log('total:', '$' + info.locked.toFixed(2))
    
    var write_out = Object.assign({}, info, {locked_value: info.locked}, { previous: previous_item })

    fs.writeFileSync('public/tvl.json', JSON.stringify(write_out, null, 2))

    await ddb.putItem({
        TableName: table,
        Item: item
    }, function (err, data) {
        if (err) {
          console.log('put error:', err);
        } else {
          console.log('put success:', data);
        }
    });

    await browser.close();
})()

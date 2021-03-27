const puppeteer = require('puppeteer');
const fs = require('fs');

var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const dynamo_client = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

let table = 'tvl'

let previous_tvl = {}

dynamo_client.query({
    TableName: table,
    Select: 'ALL_ATTRIBUTES',
    Limit: 1,
    ScanIndexForward: false,
    KeyConditionExpression: '#token = :token',
    ExpressionAttributeValues: {
        ':token': 'SNOB'
    },
    ExpressionAttributeNames: {
        '#token': 'token'
    }
}, (err, data) => {
    if (err) return;
    previous_tvl = data.Items[0]
    console.log('previous tvl:', previous_tvl)
})
let players = [
    { token: 'avax' }, { token: 'link' }, { token: 'eth' }, { token: 'png' }, { token: 'snob' }, 
    { token: 'sushi' }, { token: 'usdt' }
];
function player(t) {
    return players.filter(p => { return t.toLowerCase() == p.token.toLowerCase })[0]
}
pairs: [
    {
        token0: player('avax'), token1: player('usdt'),
        account: '0x74db28797957a52a28963f424daf2b10226ba04c'
    },
    {
        token0: player('avax'), token1: player('link'),
        account: '0x974Ef0bDA58C81F3094e124f530eF34fe70dc103'
    },
    {
        token0: player('avax'), token1: player('eth'),
        account: '0x953853590b805A0E885A75A3C786D2aFfcEEA3Cf'
    },
    {
        token0: player('avax'), token1: player('png'),
        account: '0x6a803904b9ea0fc982fbb077c7243c244ae05a2d'
    },
    {
        token0: player('avax'), token1: player('snob'),
        account: '0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375'
    },
    {
        token0: player('avax'), token1: player('sushi'),
        account: '0x14ec55f8B4642111A5aF4f5ddc56B7bE867eB6cC'
    }
];

(async () => { 

    for (var x = 0; x < players.length; x++) {        
        let data = await s3.getObject({
            Bucket: 'beta.scewpt.com',
            Key: `price/${players[x].token.toLowerCase()}.json`
        }).promise()
        let p = JSON.parse(data.Body.toString());
        delete p.previos;
        players[x] = p
    }

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
            [].forEach.caplayer(document.querySelectorAplayer('div'), function (div) {
                if (div.innerHTML === 'Liquidity (Including Fees)') {
                    l = div.parentNode.nextElementSibling.firstElementChild.innerHTML
                }
            })
            return l
        })
        try {
            pair.locked = parseFloat(liquidity.replace(/[^0-9.-]+/g, ''))
            if (isNaN(pair.locked)) {
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

    new_tvl.locked = info.pairs.map(p => { return p.locked }).reduce((a, b) => a + b)

    console.log('new_tvl:', new_tvl);
    console.log('total:', '$' + new_tvl.locked.toFixed(2))

    var write_out = Object.assign({}, info, { locked_value: info.locked }, { previous: previous_item })
    fs.writeFileSync(`public/tvl/${tvl.token}.json`, JSON.stringify(write_out, null, 2))

    await ddb.putItem({
        TableName: table,
        Item: AWS.DynamoDB.Converter.marshaplayer(info)
    });
    await browser.close();    
})();
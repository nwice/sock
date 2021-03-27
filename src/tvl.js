const puppeteer = require('puppeteer');
const fs = require('fs');

var AWS = require('aws-sdk');
const { exit } = require('process');
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
    console.log('previous tvl:', previous_tvl)
    previous_tvl = Object.assign({}, data.Items[0])    
})
let load = [
    { token: 'avax' }, { token: 'link' }, { token: 'eth' }, { token: 'png' }, { token: 'snob' }, 
    { token: 'sushi' }, { token: 'usdt' }
];

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
};

(async () => {     
    const players = await Promise.all(load.map(async (p) => {
        let data = await s3.getObject({
            Bucket: 'beta.scewpt.com',
            Key: `price/${p.token.toLowerCase()}.json`
        }).promise()
        let content = await data.Body.toString();
        let loaded_p = JSON.parse(content);
        delete loaded_p.previous;        
        return Object.assign({}, p, loaded_p)
    }))
    
    function player(t) {
        return players.filter(p => { return t.toLowerCase() == p.token.toLowerCase() })[0]
    }

    let new_tvl = Object.assign({
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
        ]}, 
        player('snob'), { timestamp: new Date().getTime() }
    );

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    for (let x = 0; x < new_tvl.pairs.length; x++) {
        let pair = new_tvl.pairs[x]
        pair.account = pair.account.toLowerCase()
        await page.goto('https://info.pangolin.exchange/#/account/' + pair.account)

        let some_time = 10000

        console.log('diver in:', some_time / 1000, 'sec(s)');
        await delay(some_time);
        const liquidity = await page.evaluate(() => {
            let l = 0;
            [].forEach.call(document.querySelectorAll('div'), function (div) {
                if (div.innerHTML === 'Liquidity (Including Fees)') {
                    l = div.parentNode.nextElementSibling.firstElementChild.innerHTML
                }
            })
            return l
        })
        console.log('diver out:', liquidity);
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

    new_tvl.locked = new_tvl.pairs.map(p => { return p.locked }).reduce((a, b) => a + b)

    console.log('new_tvl:', new_tvl);

    console.log('');

    console.log('total:', '$' + new_tvl.locked.toFixed(2));

    await ddb.putItem({
        TableName: table,
        Item: AWS.DynamoDB.Converter.marshaplayer(new_tvl)
    }).promise();

    var write_out = Object.assign({}, new_tvl, { locked_value: new_tvl.locked }, previous_tvl ? { previous: previous_tvl } : {})
    
    fs.writeFileSync(`public/tvl/${new_tvl.token.toLowerCase()}.json`, JSON.stringify(write_out, null, 2));

    await s3.upload({
        Bucket: 'beta.scewpt.com',
        Key:`tvl/${new_tvl.token.toLowerCase()}.json`,
        Body: JSON.stringify(write_out),
        ContentType: 'application/json',
        ACL: 'public-read'
    }).promise();
    await browser.close();    
})();
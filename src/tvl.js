const puppeteer = require('puppeteer');
const fs = require('fs');
const Web3 = require('web3');

var AWS = require('aws-sdk');
const { exit } = require('process');
AWS.config.update({ region: 'us-east-1' });

var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const dynamo_client = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

let table = 'tvl'

let previous_tvl = {};

let web3 = new Web3('ws://192.168.1.14:9650/ext/bc/C/ws');

var tokenABI = [{ 
    "constant": true, 
    "inputs": [{ "name": "_owner", "type": "address" }], 
    "name": "balanceOf", 
    "outputs": [{ "name": "balance", "type": "uint256" }], 
    "payable": false, 
    "type": "function" 
}];

var s3d = new web3.eth.Contract(tokenABI, '0xdE1A11C331a0E45B9BA8FeE04D4B51A745f1e4A4');

let load = [
    { token: 'avax' }, { token: 'link' }, { token: 'eth' }, { token: 'png' }, { token: 'snob' }, 
    { token: 'sushi' }, { token: 'usdt' }, { token: 'dai' }
];

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
};

(async () => {     


    const ans = await dynamo_client.query({
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
    })

    console.log('ans:', ans);

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
                token0: player('usdt'), token1: player('dai'),
                accounts: [{ contract: '0xdE1A11C331a0E45B9BA8FeE04D4B51A745f1e4A4'}]                 
            },            
            {
                token0: player('avax'), token1: player('usdt'),
                accounts: [{ stake: '0x74db28797957a52a28963f424daf2b10226ba04c'}]
            },
            {
                token0: player('avax'), token1: player('link'),
                accounts: [{ stake: '0x974Ef0bDA58C81F3094e124f530eF34fe70dc103'}, {pool: '0x00933c16e06b1d15958317C2793BC54394Ae356C'}]
            },
            {
                token0: player('avax'), token1: player('eth'),
                accounts: [{ stake: '0x953853590b805A0E885A75A3C786D2aFfcEEA3Cf'}, {pool: '0x586554828eE99811A8ef75029351179949762c26?'}]                
            },
            {
                token0: player('avax'), token1: player('png'),
                accounts: [{ stake: '0x6a803904b9ea0fc982fbb077c7243c244ae05a2d'}, {pool: '0x621207093D2e65Bf3aC55dD8Bf0351B980A63815?'}]
            },
            {
                token0: player('avax'), token1: player('snob'),
                accounts: [{ stake: '0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375'}]
            },
            {
                token0: player('avax'), token1: player('sushi'),
                accounts: [{ stake: '0x14ec55f8B4642111A5aF4f5ddc56B7bE867eB6cC'}, {pool: '0x751089F1bf31B13Fa0F0537ae78108088a2253BF?'}]
            }        
        ]}, 
        player('snob'), { timestamp: new Date().getTime() }
    );

    new_tvl.pairs[0].token2 = {
        token: 'BUSD',
        hash: '0xaeb044650278731ef3dc244692ab9f64c78ffaea'
    }

    let bo = await s3d.methods.balanceOf('0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375').call()
    new_tvl.pairs[0].accounts[0].locked = bo / 1e18    

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    
    for (let x = 0; x < new_tvl.pairs.length; x++) {
        let pair = new_tvl.pairs[x]
        let pair_id =  Object.keys(pair).filter(k => { return k.startsWith('token')}).map(k => { return pair[k].token }).join('-')
        console.log('pair id:', pair_id)
        let accounts = ['stake'];
        if ( pair.pool ) {
            accounts.push('pool')
        }

        for (let y = 0; y < pair.accounts.length; y++) {
            let account_type = Object.keys(pair.accounts[y])[0];
            let account = pair.accounts[y][Object.keys(pair.accounts[y])[0]].toLowerCase()
            if ( account_type == 'pool' || account_type == 'stake') {
                const page = await browser.newPage()
                await page.goto('https://info.pangolin.exchange/#/account/' + account.toLowerCase())
                let some_time = 30000
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
                    let locked = parseFloat(liquidity.replace(/[^0-9.-]+/g, ''))
                    console.log('locked:', locked)
                    if (isNaN(locked)) {
                        throw 'is not a number';
                    } else {
                        pair.accounts[y].locked = locked                
                        console.log('pair id:', pair_id, 'account:', pair.accounts[y])
                    }
                } catch (err) {
                    console.log('error:', err)
                    y = y - 1
                }
                await page.close()
            }
        }
        pair.locked = pair.accounts.map(a => { return a.locked }).reduce((a, b) => a + b)
        console.log('pair:', pair);
    }

    new_tvl.locked = new_tvl.pairs.map(p => { 
        return p.locked
    }).reduce((a, b) => a + b)

    console.log('new_tvl:', new_tvl);
    console.log('');
    console.log('total:', '$' + new_tvl.locked.toFixed(2));

    var write_out = Object.assign({}, new_tvl, { locked_value: new_tvl.locked }, previous_tvl ? { previous: previous_tvl } : {})

    fs.writeFileSync(`public/tvl/${new_tvl.token.toLowerCase()}.json`, JSON.stringify(write_out, null, 2));

    await s3.upload({
        Bucket: 'beta.scewpt.com',
        Key:`tvl/${new_tvl.token.toLowerCase()}.json`,
        Body: JSON.stringify(write_out),
        ContentType: 'application/json',
        ACL: 'public-read'
    }).promise();

    await ddb.putItem({
        TableName: table,
        Item: AWS.DynamoDB.Converter.marshall(new_tvl)
    }).promise();

    await browser.close();
    setTimeout( () => {
        exit()
    }, 1000)    
})();
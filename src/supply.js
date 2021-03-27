const puppeteer = require('puppeteer');
const fs = require('fs');

var AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3();
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const dynamo_client = new AWS.DynamoDB.DocumentClient();

let table = 'supply'

let previous_supply = {}

let supply = {
    total: 18000000,
    account: '0xC38f41A296A4493Ff429F1238e030924A1542e50',
    token: 'SNOB',
    timestamp: new Date().getTime()
};

dynamo_client.query({
    TableName : table,
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
    previous_supply = data.Items[0]
    console.log('previous supply:', previous_supply)
})

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {

    let data = await s3.getObject({
        Bucket: 'beta.scewpt.com',
        Key: `price/snob.json`
    }).promise()
    let content = await data.Body.toString();
    let price = JSON.parse(content);
    delete price.previous

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.goto(`https://cchain.explorer.avax.network/tokens/${supply.account}/token-transfers`);

    await delay(2000)
        
    supply.circulating = await page.evaluate(() => {
        let l = 0;
        [...document.querySelectorAll('h2')].forEach( (h2) => {
            if (h2.innerHTML === 'Total Supply') {
                l = h2.nextElementSibling.firstElementChild.innerHTML.replace(/[^0-9.]/g, '');            
            }
        });
        return parseFloat(l)
    })  
    
    let dynamo_item = Object.assign({}, supply, { price: price.price })

    console.log('dynamo supply:', dynamo_item)

    await ddb.putItem({
        TableName: table,
        Item: AWS.DynamoDB.Converter.marshall(dynamo_item)
    }).promise();  

    let s3_contents = Object.assign(price, supply, { previous: previous_supply })

    console.log('s3 supply:', s3_contents)

    fs.writeFileSync(`public/supply/${supply.token.toLowerCase()}.json`, JSON.stringify(s3_contents, null, 2))
    await browser.close();    
})()
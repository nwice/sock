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

    let file_contents = Object.assign(price, supply, { previous: previous_supply })

    console.log('s3 supply:', file_contents)
    let write_out = JSON.stringify(file_contents, null, 2)

    fs.writeFileSync(`public/supply/${supply.token.toLowerCase()}.json`, write_out)

    let increment_token = supply.token.toLowerCase();
    let increment_type = 'supply';
    let increment_out = write_out;

    let s3object = {        
        Key:`${increment_type}/${increment_token}.json`,
        Bucket: 'beta.scewpt.com',        
    }

    let redirect = await s3.headObject(s3object).promise()    
    console.log('redirect', redirect.WebsiteRedirectLocation)
    let nv = 0
    try {
        nv = parseInt(redirect.WebsiteRedirectLocation.split('/').pop().split('.')[0]) + 1
        if ( isNaN(nv) ) {
            nv = 0
        }        
    } catch (err) {
        console.log('zero file?')
        nv = 0
    }
     
    let next_version_location = `${increment_type}/${increment_token}/${nv}.json`

    console.log('new version:', nv)
    console.log('new version location:', next_version_location)
    
    await s3.upload(Object.assign({}, s3object, {        
        ACL: 'public-read',
        Body: increment_out,
        ContentType: 'application/json',
        WebsiteRedirectLocation: '/' + next_version_location        
    })).promise();    

    await s3.upload({    
        Bucket: 'beta.scewpt.com',    
        Key: next_version_location,
        Body: increment_out,
        ContentType: 'application/json',
        ACL: 'public-read'
    }).promise();

    await browser.close();    
})()
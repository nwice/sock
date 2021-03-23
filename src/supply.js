const puppeteer = require('puppeteer');
const fs = require('fs');

var AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var client = new AWS.DynamoDB.DocumentClient();

let table = 'supply'

var scan_params = {
    TableName : table,
    Select: 'ALL_ATTRIBUTES'
};

function onScan(err, data) {
    console.log('scan')
    if (err) {
        console.log('scan error:', JSON.stringify(err, null, 2));
    } else {
        console.log('scan data:', data)
        data.Items.forEach(function(item) {
            console.log('scan item:', item);
        });
        if (typeof data.LastEvaluatedKey != 'undefined') {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            client.scan(params, onScan);
        }        
    }
}

client.scan(scan_params, onScan);

var create_params = {
    AttributeDefinitions: [
        {
            AttributeName: 'circulating',
            AttributeType: 'N'
        },
        {
            AttributeName: 'timestamp',
            AttributeType: 'N'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'circulating',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'timestamp',
            KeyType: 'RANGE'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    TableName: table,
    StreamSpecification: {
        StreamEnabled: false
    }
};

// call it every time
ddb.createTable(create_params, function (err, data) {
    if (err) {
        //console.log('create error', err);
    } else {
        console.log('create info', data);
    }
});

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {

    let supply = {
        total: 18000000
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.goto('https://cchain.explorer.avax.network/tokens/0xC38f41A296A4493Ff429F1238e030924A1542e50/token-transfers');
    await delay(2000)
    const eval_circulating = await page.evaluate(() => {
        let l = 0;
        [].forEach.call(document.querySelectorAll('h2'), function (h2) {
            if (h2.innerHTML === 'Total Supply') {
                l = h2.nextElementSibling.firstElementChild.innerHTML.replace(/[^0-9.]/g, '');
            }
        })
        return l
    })
    supply.circulating = parseFloat(eval_circulating).toString()
    let item = {
        circulating : { N: supply.circulating },
        timestamp: { N: new Date().getTime().toString() },
        maxsupply: { N: supply.total.toString() }
    }
    const potential_supply = {
        TableName: table,
        Item: item
    };
    await ddb.putItem(potential_supply, function (err, data) {
        if (err) {
          console.log('put error', err);
        } else {
          console.log('put success', data);
          console.log('potential_supply:', potential_supply)
          fs.writeFileSync('public/supply.json', JSON.stringify(supply, null, 2))
        }
    });  
    await browser.close();    
})()

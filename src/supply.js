const puppeteer = require('puppeteer');
const fs = require('fs');

var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3();


let nowish = new Date().getTime()

let supplies = [{
    total: 18000000,
    account: '0xc38f41a296a4493ff429f1238e030924a1542e50',
    symbol: 'SNOB',
    timestamp: nowish
}, {
    total: 21000000,
    account: '0xe896cdeaac9615145c0ca09c8cd5c25bced6384c',
    symbol: 'PEFI',
    timestamp: nowish
}];

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}


(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });    
    await Promise.all(supplies.map( async (supply) => {
        let data = await s3.getObject({
            Bucket: 'powder.network',
            Key: `price/${supply.symbol.toLowerCase()}.json`
        }).promise();

        let content = await data.Body.toString();
        let price = JSON.parse(content);

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
        
        let file_contents = Object.assign(price, supply )
    
        console.log('s3 supply:', file_contents)
        let write_out = JSON.stringify(file_contents, null, 2)
    
        fs.writeFileSync(`public/supply/${supply.symbol.toLowerCase()}.json`, write_out)
    
        let increment_symbol = supply.symbol.toLowerCase();
        let increment_type = 'supply';
        let increment_out = write_out;
    
        let s3object = {        
            Key:`${increment_type}/${increment_symbol}.json`,
            Bucket: 'powder.network',            
        }
        
        let nv = 0
        try {
            let redirect = await s3.headObject(s3object).promise()    
            console.log('redirect', redirect.WebsiteRedirectLocation)            
            nv = parseInt(redirect.WebsiteRedirectLocation.split('/').pop().split('.')[0]) + 1
            if ( isNaN(nv) ) {
                nv = 0
            }        
        } catch (err) {
            console.log('zero file:', err)
            nv = 0
        }
         
        let next_version_location = `${increment_type}/${increment_symbol}/${nv}.json`
    
        console.log('new version:', nv)
        console.log('new version location:', next_version_location)
        
        await s3.upload(Object.assign({}, s3object, {        
            Body: increment_out,
            ContentType: 'application/json',
            ACL: 'public-read',
            WebsiteRedirectLocation: '/' + next_version_location        
        })).promise();    
    
        await s3.upload(Object.assign({}, s3object, {    
            Key: next_version_location,
            Body: increment_out,
            ContentType: 'application/json',
            ACL: 'public-read'
        })).promise();
    
        if ( supply.symbol.toLowerCase() === 'snob') {
            await s3.upload(Object.assign({}, s3object, {    
                Bucket: 'beta.scewpt.com',    
                Key: 'snob/circulating',
                Body: new String(supply.circulating),
                ACL: 'public-read',
                ContentType: 'text/plain'
            })).promise();
        }                
    }));
    await browser.close();    
})()
const fs = require('fs');
const { request, gql } = require('graphql-request');
const AWS = require('aws-sdk');
const { exit } = require('process');

AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const dynamo_client = new AWS.DynamoDB.DocumentClient();

const table = 'pricing'
const bucket = 'powder.network'

const master_skip_hash = ['0xa40903b205881e4a4da16121e2625d3997c4322d', '0x0362d330f94fae853d5c462e57357f7ef7c2ea1d', '0x212ae83a676d3cc71ee111fdaa7aa0b0cd63001c', '0x64ea9156199161b0c54825c2f117cd71dbde859c'];

const s3props = {
    ACL: 'public-read',
    ContentType: 'application/json',
}

let function_type = 'price';

const publish = (p, previous) => {
  ddb.putItem({
    TableName: table,
    Item: AWS.DynamoDB.Converter.marshall(p)
  }, (err, data) => {
    if (err) {
      console.log('put error:', err);
    }
  });

  
  let increment_symbol = p.symbol.toLowerCase();
  let increment_dex = p.dex.toLowerCase();
  let increment_out = JSON.stringify(p, null, 2);

  let s3objects = [{
    Key: `dex/${increment_dex}/${function_type}/${increment_symbol}.json`,
    Bucket: bucket,
  }]
  s3objects.forEach(s3object => {
    s3.headObject(s3object, (err, redirect) => {
      let nv = 0
      try {
        nv = parseInt(redirect.WebsiteRedirectLocation.split('/').pop().split('.')[0]) + 1
        if (isNaN(nv)) {
          nv = 0
        }
      } catch (err2) {
        console.log('zero file:', err2)
        nv = 0
      }          

      let next_version_location = s3object.Key.substring(0, s3object.Key.length - 5).concat(`/${nv}.json`)      
      console.log('new version:', nv, 'new version location:', next_version_location)

      s3.upload(Object.assign({}, s3props, s3object, {        
        Body: increment_out,
        WebsiteRedirectLocation: '/' + next_version_location
      })).promise();

      s3.upload(Object.assign({}, s3props, s3object, {        
        Body: increment_out,
        Key: next_version_location,
      })).promise();
    });
  })
}

const dexes = [
  { symbol: 'png', endpoint: 'https://pango-info.scewpt.com/subgraphs/name/dasconnor/pangolindex'},
  { symbol: 'yts', endpoint: 'https://graph.yetiswap.app/subgraphs/name/yetiswap/yetiswap2'},
  { symbol: 'elk', endpoint: 'https://avax-graph.elk.finance/subgraphs/name/elkfinance/elkdex-avax'}
];

const priceql = gql`{  
  pairs(skip: 0) {
    token0Price
    token0 {
      id
      symbol
      name
      tradeVolume
    }
    token1Price
    token1 {
      id
      symbol
      name
      tradeVolume
    }
    totalSupply   
  }
}`

const wavax = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'
const usdt = '0xde3a24028580884448a5397872046a019649b084'

const get_price = (pair, id) => {
  return parseFloat(pair.token0.id === id ? pair.token0Price : pair.token1Price)
}

const get_token = (pair, id, inverse) => {
  if (inverse) {
    return pair.token0.id === id ? pair.token1 : pair.token0
  } else {
    return pair.token0.id === id ? pair.token0 : pair.token1
  }
}

const pair_contains = (pair, id) => {
  return pair.token0.id === id || pair.token1.id === id
}

const prices = []

const now = new Date().getTime();

(async () => {
  await Promise.all(dexes.map( async (d) => {
    let priceData = await request(d.endpoint, priceql, {})
    console.log('pairs length:', priceData.pairs.length)
    let base = { dex: d.symbol, timestamp: now };
    
    priceData.pairs.forEach(p => {
      p.token0.tradeVolume = parseFloat(p.token0.tradeVolume)
      p.token1.tradeVolume = parseFloat(p.token1.tradeVolume)
    })
    let basepair = priceData.pairs.filter(p => { return pair_contains(p, wavax) && pair_contains(p, usdt) })[0];
    let avaxprice = get_price(
      basepair,
      usdt
    )

    prices.push(Object.assign({}, base, get_token(basepair, wavax), { price: avaxprice }))
    prices.push(Object.assign({}, base, get_token(basepair, usdt), { price: get_price(basepair, wavax) * avaxprice }))

    priceData.pairs.filter(p => { return p != basepair && pair_contains(p, wavax) }).forEach(p => {
      let notavax = get_token(p, wavax, true)
      prices.push(Object.assign({}, base, notavax, { price: get_price(p, wavax) * avaxprice }))
    })
    prices.filter(p => !master_skip_hash.includes(p.id)).forEach(p => {
      console.log('id:', p.id, 'dex:', p.dex, 'symbol:', p.symbol, 'price:', p.price, 'tradeVolume:', p.tradeVolume)    
      dynamo_client.query({
        TableName: table,
        Select: 'ALL_ATTRIBUTES',
        Limit: 1,
        ScanIndexForward: false,
        KeyConditionExpression: '#id = :id',
        FilterExpression: "#dex = :dex",
        ExpressionAttributeValues: {
          ':id': p.id,
          ':dex': p.dex
        },
        ExpressionAttributeNames: {
          '#id': 'id',
          '#dex': 'dex',
        }
      }, (err, data) => {
        if (err) {
          console.log('token query error:', JSON.stringify(err, null, 2));
        } else {
          let path = `dex/${p.dex}/${function_type}/${p.symbol}.json`.toLowerCase()          
          fs.writeFileSync('public/' + path.toLowerCase(), JSON.stringify(p, null, 2) )          
          if (data.Items.length > 0 && data.Items[0].price == p.price) {
            console.log('price ignore:', p.symbol, 'price:', p.price)
          } else {
            console.log('volume:', p.tradeVolume, 'publish:', p.symbol, 'price:', p.price, 'previous:', data.Items.length > 0 ? new Date(data.Items[0].timestamp).toLocaleDateString() : null)
            //publish(p, data.Items.length > 0 ? data.Items[0] : null)
          }
        }
      });
    })
  }))
})();

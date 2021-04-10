const fs = require('fs');
const { request, gql } = require('graphql-request');
const AWS = require('aws-sdk');
const { exit } = require('process');
const Web3 = require('web3');

const web3 = new Web3('wss://api.avax.network/ext/bc/C/ws');
const nowish = new Date().getTime();

var tokenABI = [{ 
  "constant": true, 
  "inputs": [{ "name": "_owner", "type": "address" }], 
  "name": "balanceOf", 
  "outputs": [{ "name": "balance", "type": "uint256" }], 
  "payable": false, 
  "type": "function" 
}];

AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3();

const bucket = 'powder.network'

const master_skip_hash = ['0xc5b25a5bed03bb7c9030dfe5be56f21f5c3fcb1b', '0x67e1e9195e3e3eebc862b83af9abe1fa24d108f5', '0xa40903b205881e4a4da16121e2625d3997c4322d', '0x0362d330f94fae853d5c462e57357f7ef7c2ea1d', '0x212ae83a676d3cc71ee111fdaa7aa0b0cd63001c', '0x64ea9156199161b0c54825c2f117cd71dbde859c'];

const s3props = {
    ACL: 'public-read',
    ContentType: 'application/json',
}

let function_type = 'price';

const dexes = [
  { symbol: 'olive', tokens: [{ lp: '0xF54a719215622f602FCA5BF5a6509734C3574a4c', token: {
    "dex": "olive",
    "timestamp": nowish,
    "hash": "0x617724974218a18769020a70162165a539c07e8a",
    "name": "OliveCash Token",
    "symbol": "OLIVE"
    }}]},
  { symbol: 'png', endpoint: 'https://pango-info.scewpt.com/subgraphs/name/dasconnor/pangolindex'},
  { symbol: 'yts', tokens: [{ lp: '0xF1E800Ab9D0D1F6eaFf54E00Ad19710c41b154f2', token: {
    "dex": "yts",
    "timestamp": nowish,
    "hash": "0x488f73cddda1de3664775ffd91623637383d6404",
    "name": "YetiSwap",
    "symbol": "YTS"
    }}]},
  { symbol: 'elk', endpoint: 'https://avax-graph.elk.finance/subgraphs/name/elkfinance/elkdex-avax'},
  { symbol: 'com', endpoint: 'https://graph.avagraph.live/subgraphs/name/complusnetwork/subgraph-ava'},
  { symbol: 'zero', endpoint: 'https://zero-graph.0.exchange/subgraphs/name/zeroexchange/zerograph', stable: '0x474bb79c3e8e65dcc6df30f9de68592ed48bbfdb'}
];

const priceql = gql`query getPairs($skip: Int!) {  
  pairs(skip: $skip) {
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

const clean = (p) => {
  if ( p.id ) {
    p.hash = p.id
    delete p.id
  }
  return p
}

const prices = [];

(async () => {
  for (var x = 0; x < dexes.length; x++) {
    let d = dexes[x]
    let skip = 0
    let pairs = []
    if ( d.endpoint ) {
      while ( skip % 100 == 0 ) {
        console.log('endpoint:', d.endpoint)
        let priceData = await request(d.endpoint, priceql, { skip })
        pairs = [...pairs,...priceData.pairs]
        console.log('pairs length:', priceData.pairs.length)
        skip = priceData.pairs.length
      }
      let base = { dex: d.symbol, timestamp: nowish };
      pairs.forEach(p => {
        p.token0.tradeVolume = parseFloat(p.token0.tradeVolume)
        p.token1.tradeVolume = parseFloat(p.token1.tradeVolume)
      });
      let basepair = pairs.filter(p => { return pair_contains(p, wavax) && pair_contains(p, d.stable ? d.stable : usdt) })[0];
      let avaxprice = get_price(
        basepair,
        d.stable ? d.stable : usdt
      )

      console.log('dex:', d.symbol, 'avaxprice:', avaxprice);

      prices.push(
        clean(Object.assign({}, base, get_token(basepair, wavax), { price: avaxprice }))
      )
      prices.push(
        clean(Object.assign({}, base, get_token(basepair, d.stable ? d.stable : usdt), { price: get_price(basepair, wavax) * avaxprice }))
      )
  
      pairs.filter(p => { return p != basepair && pair_contains(p, wavax) }).forEach(p => {
        let notavax = get_token(p, wavax, true)
        prices.push(
          clean(Object.assign({}, base, notavax, { price: get_price(p, wavax) * avaxprice }))
        )
      })      
    } else {
      for (var y = 0; y < d.tokens.length; y++) {
        let t0 = new web3.eth.Contract(tokenABI, usdt);
        let t1 = new web3.eth.Contract(tokenABI, d.tokens[y].token.hash);
        let t1supply = await t1.methods.balanceOf(d.tokens[y].lp).call()        
        let t0supply = await t0.methods.balanceOf(d.tokens[y].lp).call()        
        let wtf = Object.assign({}, d.tokens[y].token, { price: t0supply / t1supply * 1e12 })        
        prices.push(
          clean(wtf)
        );
      }
    }  
    prices.filter(p => !master_skip_hash.includes(p.hash)).forEach(async (p) => {

      let path = `dex/${p.dex}/${function_type}/${p.symbol}.json`.toLowerCase()          
      fs.writeFileSync('public/' + path.toLowerCase(), JSON.stringify(p, null, 2) )          

      let increment_symbol = p.symbol.toLowerCase();
      let increment_dex = p.dex.toLowerCase();
      let increment_out = JSON.stringify(p, null, 2);
    
      let s3object = {
        Key: `dex/${increment_dex}/${function_type}/${increment_symbol}.json`,
        Bucket: bucket,
      }
      let nv = 0
      let previous = { price: 0 }
      try {
        let data = await s3.getObject(s3object).promise()
        let data_string = await data.Body.toString();
        previous = JSON.parse(data_string)
        nv = parseInt(data.WebsiteRedirectLocation.split('/').pop().split('.')[0]) + 1
        if (isNaN(nv) || nv < 0) {
          nv = 0
        }          
      } catch (err) {}

      if (previous.price != p.price) {
        let next_version_location = s3object.Key.substring(0, s3object.Key.length - 5).concat(`/${nv}.json`)      
        console.log('new version location:', next_version_location, 'price:', p.price, 'previous:', previous.price)
  
        s3.upload(Object.assign({}, s3props, s3object, {        
          Body: increment_out,
          WebsiteRedirectLocation: '/' + next_version_location
        })).promise();
  
        s3.upload(Object.assign({}, s3props, s3object, {        
          Body: increment_out,
          Key: next_version_location,
        })).promise();  
      }
    });
  }
  setTimeout( () => {
    exit(0)
  }, 1000)
})();

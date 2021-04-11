import fs from 'fs';
import { request, gql } from 'graphql-request';
import Web3 from 'web3';
import { versioning } from './versioning.js';
import { dexes, tokens } from './sconfig.js';
import { exit } from 'process';

const abi = JSON.parse(fs.readFileSync('public/abi.json'));

const web3 = new Web3('wss://api.avax.network/ext/bc/C/ws');
const nowish = new Date().getTime();

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

const get_price = (pair, find) => {
  return parseFloat(pair.token0.id.toLowerCase() === find.id.toLowerCase() ? pair.token0Price : pair.token1Price)
}

const get_token = (pair, find, inverse) => {
  if (inverse) {
    return pair.token0.id.toLowerCase() === find.id.toLowerCase() ? pair.token1 : pair.token0
  } else {
    return pair.token0.id.toLowerCase() === find.id.toLowerCase() ? pair.token0 : pair.token1
  }
}

const pair_contains = (pair, find) => {
  return pair.token0.id.toLowerCase() === find.id.toLowerCase() || pair.token1.id.toLowerCase() === find.id.toLowerCase()
}

const prices = [];

await Promise.all(Object.keys(dexes).map(k => { 
    return { dex: dexes[k], dex_name: k } 
  }).filter(d => { return d.dex.pricing === undefined || d.dex.pricing === true }).map(async (dex_obj) => {
  let dex = dex_obj.dex
  let dex_name = dex_obj.dex_name
  let skip = 0
  let pairs = []
  if ( dex.graphql ) {
    while ( skip % 100 == 0 ) {      
      let priceData = await request(dex.graphql, priceql, { skip })
      pairs = [...pairs,...priceData.pairs]
      skip = priceData.pairs.length
    }
    let base = { timestamp: nowish };
    pairs.forEach(p => {
      p.token0.tradeVolume = parseFloat(p.token0.tradeVolume)
      p.token1.tradeVolume = parseFloat(p.token1.tradeVolume)
    });
    let basepair = pairs.filter(p => { 
      return pair_contains(p, tokens.wavax) && pair_contains(p, dex.stable ? dex.stable : tokens.usdt) 
    })[0];
    let avaxprice = get_price(
      basepair,
      dex.stable ? dex.stable : tokens.usdt
    )

    prices.push(
      Object.assign({}, base, get_token(basepair, tokens.wavax), { price: avaxprice }, { dex: dex_name })
    )
    prices.push(
      Object.assign({}, base, get_token(basepair, dex.stable ? dex.stable : tokens.usdt), { price: get_price(basepair, tokens.wavax) * avaxprice }, { dex: dex_name })
    )

    pairs.filter(p => { return p != basepair && pair_contains(p, tokens.wavax) }).forEach(p => {
      let notavax = get_token(p, tokens.wavax, true)
      prices.push(
        Object.assign({}, base, notavax, { price: get_price(p, tokens.wavax) * avaxprice }, { dex: dex_name })
      )
    })      
  } else {
    for (var y = 0; y < dex.tokens.length; y++) {
      let t0 = new web3.eth.Contract(abi, tokens.usdt.id);
      let t1 = new web3.eth.Contract(abi, dex.tokens[y].token.id);
      let t1supply = await t1.methods.balanceOf(dex.tokens[y].pair.id).call()        
      let t0supply = await t0.methods.balanceOf(dex.tokens[y].pair.id).call()        
      prices.push(Object.assign({}, dex.tokens[y].token, { price: t0supply / t1supply * 1e12 }, { dex: dex_name }));
    }
  }
}));

const master_skip = ['0xc5b25a5bed03bb7c9030dfe5be56f21f5c3fcb1b', '0x67e1e9195e3e3eebc862b83af9abe1fa24d108f5', '0xa40903b205881e4a4da16121e2625d3997c4322d', '0x0362d330f94fae853d5c462e57357f7ef7c2ea1d', '0x212ae83a676d3cc71ee111fdaa7aa0b0cd63001c', '0x64ea9156199161b0c54825c2f117cd71dbde859c'];

const price_different = (p, previous) => {
  if ( p.price === previous.price ) {
    return false
  }
  return true
}

prices.filter(p => !master_skip.map(msi => msi.toLowerCase()).includes(p.id.toLowerCase())).forEach(async (p) => {
  versioning(p, 'price', price_different)
})
setTimeout( () => {
  exit(0) 
}, 1000)
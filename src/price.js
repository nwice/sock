import fs from 'fs';
import Web3 from 'web3';
import { dexes, tokens } from './statemachine.js';
import { exit } from 'process';
import { versioning } from './versioning.js';
import { dexpairs } from './graph.js';

const abi = JSON.parse(fs.readFileSync('public/abi.json'));

const web3 = new Web3('wss://api.avax.network/ext/bc/C/ws');
const nowish = new Date().getTime();

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
  }).filter(d => { return d.dex?.amm === undefined || d.dex.amm === true }).map(async (dex_obj) => {
  if ( dex_obj.dex.graphql ) {
    let base = { timestamp: nowish };    
    console.log('dex pairs length:', dex_obj.dex.pairs.length)
    dex_obj.dex.pairs.forEach(p => {
      p.token0.tradeVolume = parseFloat(p.token0.tradeVolume)
      p.token1.tradeVolume = parseFloat(p.token1.tradeVolume)
    });
    let basepair = dex_obj.dex.pairs.filter(p => { 
      return pair_contains(p, tokens.wavax) && pair_contains(p, dex_obj.dex.stable ? dex_obj.dex.stable : tokens.usdt) 
    })[0];
    let avaxprice = get_price(
      basepair,
      dex_obj.dex.stable ? dex_obj.dex.stable : tokens.usdt
    )
    console.log(dex_obj.dex_name, 'avaxprice:', avaxprice)

    prices.push(
      Object.assign({}, base, get_token(basepair, tokens.wavax), { price: avaxprice }, { dex: dex_obj.dex_name })
    )
    prices.push(
      Object.assign({}, base, get_token(basepair, dex_obj.dex.stable ? dex_obj.dex.stable : tokens.usdt), { price: get_price(basepair, tokens.wavax) * avaxprice }, { dex: dex_obj.dex_name })
    )
    dex_obj.dex.pairs.filter(p => { return p != basepair && pair_contains(p, tokens.wavax) }).forEach(p => {
      let notavax = get_token(p, tokens.wavax, true)
      let price = Object.assign({}, base, notavax, { price: get_price(p, tokens.wavax) * avaxprice }, { dex: dex_obj.dex_name })
      prices.push(
        price
      )
    })      
  } else {
    for (var y = 0; y < dex_obj.dex.tokens.length; y++) {
      let t0 = new web3.eth.Contract(abi, tokens.usdt.id);
      let t1 = new web3.eth.Contract(abi, dex_obj.dex.tokens[y].token.id);
      let t1supply = await t1.methods.balanceOf(dex_obj.dex.tokens[y].pair.id).call()        
      let t0supply = await t0.methods.balanceOf(dex_obj.dex.tokens[y].pair.id).call()        
      let dex_specific = Object.assign({}, dex_obj.dex.tokens[y].token, { price: t0supply / t1supply * 1e12 }, { dex: dex_obj.dex_name })
      prices.push(dex_specific);
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

const any_price_different = (all, all_previous) => {
  if ( all.length === all_previous.length ) {
    return all.map(p => {
      let changed = false;
      let compare_to = all_previous.filter(previous => { return previous.id === p.id && previous.dex === p.dex })[0]
      if ( compare_to === undefined ) {
        console.log('missing:', p.symbol, 'to:', p.price)        
        changed = true;
      } else if ( compare_to.price !== p.price ) {
        console.log('change:', p.symbol, 'to:', p.price, 'from:', compare_to?.price)
        changed = true;
      }
      return { changed, p, compare_to}
    }).filter(b => b.changed).length === 0 ? false : true;    
  }
  return true
}

const publishable = prices.filter(p => !master_skip.map(msi => msi.toLowerCase()).includes(p.id.toLowerCase()));

versioning(publishable, `dex/prices.json`, any_price_different)


const clean_symbol = (s) => {
  if ( s.length == 2) {
    return s.codePointAt(0).toString(16)
  }
  return s
}

publishable.forEach(async (p) => {  
  versioning(p, `dex/${p.dex}/price/${clean_symbol(p.symbol)}.json`.toLowerCase(), price_different)
})

setTimeout( () => {
  console.log('prices length:', prices.length)
  exit(0) 
}, 1000)
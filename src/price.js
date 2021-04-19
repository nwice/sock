import { dex_avaxprice, pair_contains, get_token, get_token_by_symbol, get_price, refuse, pairnick } from './util.js';
import { tokens } from './statemachine.js';
import { exit } from 'process';

const nowish = new Date().getTime();

const pairscore = (pair, base, dex_name) => {
  let stabletoken = get_token(base, tokens.wavax, true)  
  let dextoken = tokens[dex_name ? dex_name: 'png']
  if ( !dextoken ) {
    console.log('dex name:', dex_name, pair)
    exit()
  }
  if ( pair_contains(pair, tokens.wavax) && pair_contains(pair, stabletoken) ) {
    return 9
  } else if ( pair_contains(pair, tokens.wavax) && pair_contains(pair, dextoken) ) {    
    return 8
  } else if ( pair_contains(pair, tokens.wavax) ) {
    return 7
  } else if ( pair_contains(pair, stabletoken) ) {
    return 6
  } else if ( pair_contains(pair, dextoken) ) {
    return 5
  } else if ( pair_contains(pair, tokens.eth) || pair_contains(pair, tokens.wbtc) ) {
    return 4
  } else {
    let t0 = pair.token0.symbol.toLowerCase();
    let t1 = pair.token0.symbol.toLowerCase();
    if ( tokens[t0] && tokens[t1] ) {
      return 3
    } else if ( tokens[t0] || tokens[t1] ) {
      return 2
    }
  }
  return 1
};

const getpriced = (prices, token) => {
  let pt;
  prices.forEach(price => {
    if ( token.id.toLowerCase() === price.id.toLowerCase() && pt === undefined) {
      pt = price
    }    
  })
  return pt
}

const accept = (pair) => {
  return !refuse.includes(pair.token0.id.toLowerCase()) && !refuse.includes(pair.token1.id.toLowerCase())
}

const notpriced = (pair) => {
  return pair.token0.price === undefined || pair.token1.price === undefined
}

const func = (prices, token) => {
  if ( prices.filter(p => { return p.id.toLowerCase() === token.id.toLowerCase() && p.dex === token.dex}).length > 0 ) {
    return;
  }
  prices.push(token)
  let ft = tokens[token.symbol.toLowerCase()]
  if ( ft ) {
    if ( !ft.prices ) {
      ft.prices = [];
      ft.prices.push(token)
    } else {
      let op = ft.prices.filter(p => { return p.id.toLowerCase() === token.id.toLowerCase() && p.dex === token.dex })
      if ( op.length > 0 ) {
        op.forEach(o => {
          Object.assign(o, token)
        })
      } else {
        ft.prices.push(token)
      }
    }    
  }
}

const dexprices = (dex_list) => {
  return Promise.all(Object.keys(dex_list).map(k => {
    return { dex: dex_list[k], dex_name: k }
  }).filter(d => { return d.dex?.amm === undefined || d.dex.amm === true }).map(async (dex_obj) => {
    let prices = [];
    if (dex_obj.dex.graphql) {
      let base = { timestamp: nowish };
      console.log('dex pairs length:', dex_obj.dex.pairs.length)
      dex_obj.dex.pairs.forEach(p => {
        p.token0.tradeVolume = parseFloat(p.token0.tradeVolume)
        p.token1.tradeVolume = parseFloat(p.token1.tradeVolume)
      });

      let basepricearray = dex_avaxprice(dex_obj)
      
      let basepair = basepricearray[0];
      let avaxprice = basepricearray[2];

      let avaxtoken = get_token(basepair, tokens.wavax)
      let stabletoken = get_token(basepair, tokens.wavax, true)

      Object.assign(avaxtoken, base, { price: avaxprice }, { dex: dex_obj.dex_name })
      func(prices, avaxtoken)
      Object.assign(stabletoken, base, { price: get_price(basepair, tokens.wavax) * avaxprice }, { dex: dex_obj.dex_name })
      func(prices, stabletoken)

      let dexpair = basepricearray[1];
      Object.assign(get_token(dexpair, tokens.wavax), avaxtoken)
      let dextoken = get_token(dexpair, tokens.wavax, true)
      let dexprice = get_price(dexpair, tokens.wavax) * avaxprice
      Object.assign(dextoken, base, { price: dexprice }, { dex: dex_obj.dex_name })
      func(prices, dextoken);

      dex_obj.dex.pairs.sort((a, b) => {        
        return pairscore(b, basepair, dex_obj.dex_name) - pairscore(a, basepair, dex_obj.dex_name);
      })
      dex_obj.dex.pairs.filter( p => { 
        return ![basepair, dexpair].includes(p) && accept(p)
      }).forEach( pair => {
        if ( pair_contains(pair, tokens.wavax) ) {
          let notavax = get_token(pair, tokens.wavax, true);
          Object.assign(notavax, base, { price: get_price(pair, tokens.wavax) * avaxprice }, { dex: dex_obj.dex_name })
          func(prices, notavax)
          Object.assign(get_token(pair, tokens.wavax), avaxtoken)
        } else if (pair_contains(pair, stabletoken) ) {
          let op = pair.token0.symbol.toLowerCase() === stabletoken.symbol.toLowerCase() ? parseFloat(pair.token0Price) : parseFloat(pair.token1Price)
          let notstable = get_token(pair, stabletoken, true)
          Object.assign(notstable, base, { price: op / avaxprice }, { dex: dex_obj.dex_name })
          func(prices, notstable)
          Object.assign(get_token(pair, stabletoken), stabletoken)
        } else if (pair_contains(pair, tokens[dex_obj.dex_name]) ) {
          let ot = get_token(pair, tokens[dex_obj.dex_name], true)
          let otp = get_price(pair, tokens[dex_obj.dex_name]) * dexprice
          //let otp2 = get_price(pair, tokens[dex_obj.dex_name], true) * dexprice
          //console.log(pairnick(pair), otp, otp2)          
          Object.assign(ot, base, { price: otp}, { dex: dex_obj.dex_name })
          func(prices, ot)
          Object.assign(get_token(pair, tokens[dex_obj.dex_name]), base, dextoken, { dex: dex_obj.dex_name })
        }
      })
      dex_obj.dex.pairs.filter( p => { 
        return accept(p) && notpriced(p)
      }).forEach(p => {      
        if ( p.token0.price === undefined ) {
          let t0 = getpriced(prices, p.token0)  
          if ( t0 ) {
            Object.assign(p.token0, t0)
          }            
        }
        if ( p.token1.price === undefined ) {
          let t1 = getpriced(prices, p.token1)  
          if ( t1 ) {
            Object.assign(p.token1, t1)
          }
        }        
      });
      console.log('missing:', dex_obj.dex.pairs.filter( p => { 
        return accept(p) && notpriced(p)
      }).length)
    }
    return prices.filter(p => { return p.price })
  })).then(results => {
    return results.flat()
  });
}

export { dexprices }
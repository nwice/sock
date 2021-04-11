import { request, gql } from 'graphql-request';
import { dexes, tokens } from './statemachine.js';
import { versioning, getcurrent } from './versioning.js';
import { exit } from 'process';

const endpoint = 'https://graph-node.avax.network/subgraphs/name/dasconnor/pangolindex'

const query_swaps = gql`query getSwaps($to: String!, $skip: Int!) {
  swaps(skip: $skip, where: { to: $to }, orderBy: timestamp, orderDirection: asc) {
    timestamp
    from
    amount0In
    amount1In
    amount0Out
    amount1Out
    transaction {
      id
    }
    pair {
      id
      token0 {
        symbol
        id
      }
      token1 {
        symbol
        id
      }      
    }    
  }
}`;

const query_block = gql`query pairHourData($pair: String!, $ts: Int!) {
  pairHourDatas(first: 1, orderBy:hourStartUnix, orderDirection: desc,  where: { pair: $pair, hourStartUnix_lte: $ts}) {    
    id
    hourStartUnix
    reserve0
    reserve1
    pair {
      token0 {
        symbol
      }
      token1 {
        symbol
      }      
    }    
  }
}`;

const force = async (pair, ts) => {
  let response = {}
  while ( response.pairHourDatas === undefined ) {    
    try {
        response = await request(endpoint, query_block, { pair: pair.id, ts: parseInt(ts)})
    } catch (err) {
        console.log('pricing error:', err);
    }
  }
  return response
};

const history = async (strategy, dex_name) => {
  let path = `dex/${dex_name}/harvest/${strategy.id}.json`.toLowerCase()
  let current = await getcurrent(path)
  let skip = current.version * 2
  let swaps = []
  while (skip == 0 || skip % 100 == 0) {
      console.log('skip:', skip, 'id:', strategy.id)            
      let response = await request(endpoint, query_swaps, { to: strategy.id, skip });
      if (!response.swaps) break;
      swaps = [...swaps,...response.swaps]
      skip = skip + response.swaps.length
  }  
  console.log('total harvest swaps length:', swaps.length)
  for (var y = 0; y < swaps.length; y+=2) {
      let harvest = { claim: swaps[y], reinvest: swaps[y+1] };
      await new Promise(resolve => setTimeout(resolve, 250));                           
      let claim_pricing = await force( { id: strategy.priced }, harvest.claim.timestamp)
      harvest.claim.pair.token0.price = parseFloat(claim_pricing.pairHourDatas[0].reserve1) / parseFloat(claim_pricing.pairHourDatas[0].reserve0)      
      console.log('claim pricing:', harvest.claim.pair.token0.price)      
      harvest.claim.amount0InUSD = harvest.claim.pair.token0.price * parseFloat(harvest.claim.amount0In)
      harvest.claim.pair.token1.price = harvest.claim.amount0InUSD / parseFloat(harvest.claim.amount1Out)
      console.log('split pricing:', harvest.claim.pair.token1.price)      
      if ( harvest.claim.pair.id == harvest.reinvest.pair.id ) {
        harvest.reinvest.pair.token0.price = harvest.claim.pair.token0.price
        harvest.reinvest.pair.token1.price = harvest.claim.pair.token1.price
      } else if (harvest.claim.pair.token1.id === harvest.reinvest.pair.token0.id) {
        harvest.reinvest.pair.token0.price = harvest.claim.pair.token1.price
        harvest.reinvest.pair.token1.price = harvest.reinvest.pair.token0.price * parseFloat(harvest.reinvest.amount0In) / parseFloat(harvest.reinvest.amount1Out)
        console.log('reinvest pricing:', harvest.reinvest.pair.token1.price, 'symbol:', harvest.reinvest.pair.token1.symbol)      
      } else if (harvest.claim.pair.token1.id === harvest.reinvest.pair.token1.id) {
        harvest.reinvest.pair.token1.price = harvest.claim.pair.token1.price
        harvest.reinvest.pair.token0.price = harvest.reinvest.pair.token1.price * parseFloat(harvest.reinvest.amount1In) / parseFloat(harvest.reinvest.amount0Out)
        console.log('reinvest pricing:', harvest.reinvest.pair.token0.price, 'symbol:', harvest.reinvest.pair.token0.symbol)      
      } else {
        console.log('no match:', JSON.stringify(harvest))
        exit(0)
      }
      harvest.reinvest.amount1OutUSD = harvest.reinvest.pair.token0.price * parseFloat(harvest.reinvest.amount0In)
      await versioning(harvest, path)
  }
}

await Promise.all(Object.keys(dexes).map(k => { return {dex_name: k, dex: dexes[k]}}).filter(d => Array.isArray(d.dex.strategies) ).map(async dex_obj => {
  for (var x = 0; x < dex_obj.dex.strategies.length; x++) {
    await history(dex_obj.dex.strategies[x], dex_obj.dex_name);
  }  
}));

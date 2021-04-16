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
  let increment = strategy.single  ? 1 : 2;
  console.log('increment:', increment)
  let skip = current.version * increment
  let swaps = []
  while (skip == 0 || skip % 100 == 0) {
      console.log('skip:', skip, 'id:', strategy.id)            
      let response = await request(endpoint, query_swaps, { to: strategy.id, skip });
      if (!response.swaps) break;
      swaps = [...swaps,...response.swaps]
      skip = skip + response.swaps.length
  }  
  console.log('total harvest swaps length:', swaps.length)
  for (var y = 0; y < swaps.length; y+=increment) {
      let harvest = { claim: swaps[y] };
      await new Promise(resolve => setTimeout(resolve, 100));
      let claim_pricing = await force( { id: strategy.priced }, harvest.claim.timestamp)
      harvest.claim.pair.token0.price = parseFloat(claim_pricing.pairHourDatas[0].reserve1) / parseFloat(claim_pricing.pairHourDatas[0].reserve0)      
      
      harvest.claim.amountUSD = harvest.claim.pair.token0.price * parseFloat(harvest.claim.amount0In)
      harvest.claim.pair.token1.price = harvest.claim.amountUSD / parseFloat(harvest.claim.amount1Out)
      console.log(harvest.claim.pair.token0.symbol, 'price:', harvest.claim.pair.token0.price, harvest.claim.pair.token1.symbol, 'price:', harvest.claim.pair.token1.price, 'usd:', harvest.claim.amountUSD)      
      if ( strategy.single ) {
      } else {
        harvest.reinvest = swaps[y+1];
        if (harvest.claim.pair.token1.id === harvest.reinvest.pair.token0.id) {
          harvest.reinvest.pair.token0.price = harvest.claim.pair.token1.price
          harvest.reinvest.pair.token1.price = harvest.reinvest.pair.token0.price * parseFloat(harvest.reinvest.amount0In) / parseFloat(harvest.reinvest.amount1Out)
          harvest.reinvest.amountUSD = harvest.reinvest.pair.token0.price * parseFloat(harvest.reinvest.amount0In)
          console.log('1 reinvest:', harvest.reinvest.pair.token1.symbol, 'price:', harvest.reinvest.pair.token1.price, 'usd:', harvest.reinvest.amountUSD)
        } else if (harvest.claim.pair.token1.id === harvest.reinvest.pair.token1.id) {
          harvest.reinvest.pair.token1.price = harvest.claim.pair.token1.price
          harvest.reinvest.pair.token0.price = harvest.reinvest.pair.token1.price * parseFloat(harvest.reinvest.amount1In) / parseFloat(harvest.reinvest.amount0Out)          
          harvest.reinvest.amountUSD = harvest.reinvest.pair.token1.price * parseFloat(harvest.reinvest.amount1In)
          console.log('2 reinvest:', harvest.reinvest.pair.token0.symbol, 'price:', harvest.reinvest.pair.token0.price, 'usd:', harvest.reinvest.amountUSD)
        }        
      }      
      await versioning(harvest, path)
  }
}

await Promise.all(Object.keys(dexes).map(k => { return {name: k, dex: dexes[k]}}).filter(d => Array.isArray(d.dex.strategies) ).map(async dex_obj => {
  for (var x = 0; x < dex_obj.dex.strategies.length; x++) {
    await history(dex_obj.dex.strategies[x], dex_obj.name);
  }  
}));

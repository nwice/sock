import { request, gql } from 'graphql-request';

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
        token0 {
          symbol
        }
        token1 {
          symbol
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
    }
  }`;

let rewardusdt = '0xe8acf438b10a2c09f80aef3ef2858f8e758c98f9';
let all_total = 0;

const history = (strategy) => {
  let total = 0;
  let skip = 0;
  let swaps = []
  while (skip == 0 || skip % 100 == 0) {
      //console.log('skip:', skip)            
      let response = await request(endpoint, query_swaps, { to: strategy.to, skip });
      if (!response.swaps) break;
      swaps = [...swaps,...response.swaps]
      skip += response.swaps.length
  }
  //console.log('total swaps:', swaps.length);
  for (var y = 0; y < swaps.length; y++) {
      await new Promise(resolve => setTimeout(resolve, 500));               
      let swap = swaps[y];
      if ( swap.pair.token0.symbol === 'PNG' ) {
          //console.log('y:', y)
          let pricing_response = {}
          while ( !pricing_response.pairHourDatas ) {
              try {
                  pricing_response = await request(endpoint, query_block, { pair, ts: parseInt(swap.timestamp)});
              } catch (err) {
                  console.log('pricing error:', err);
              }
          }
          let png_price = pricing_response.pairHourDatas[0].reserve1 / pricing_response.pairHourDatas[0].reserve0                
          let addto = swap.amount0In * png_price
          let dated = new Date(parseInt(swap.timestamp) * 1000)
          console.log(`${strategy.pair} png price:`, png_price, 'add to:', addto, 'date:', dated.toLocaleDateString() + ' ' + dated.toLocaleTimeString())
          total += addto                
      }
  }
}

(async () => {
    for (var x = 0; x < strategies.length; x++) {
        let strategy = strategies[x];
    
        console.log(`${strategy.pair} total:`, total)
        all_total += total
    }    
    console.log('all total:', all_total)
})();



strategies.forEach( async (strategy)

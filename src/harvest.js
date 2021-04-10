const { request, gql } = require('graphql-request');

const endpoint = 'https://graph-node.avax.network/subgraphs/name/dasconnor/pangolindex'
const query_swaps = gql`query getSwaps($to: String!, $skip: Int!) {
    swaps(skip: $skip, where: { to: $to }, orderBy: timestamp, orderDirection: desc) {
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

let strategies = [
    { to: '0x974Ef0bDA58C81F3094e124f530eF34fe70dc103', pair: 'avax-link' },
    { to: '0x6A803904b9eA0Fc982fBB077c7243c244Ae05a2d', pair: 'avax-png'},
    { to: '0x953853590b805A0E885A75A3C786D2aFfcEEA3Cf', pair: 'avax-eth'},
    { to: '0x14ec55f8B4642111A5aF4f5ddc56B7bE867eB6cC', pair: 'avax-sushi'},    
    { to: '0x74dB28797957a52a28963F424dAF2B10226ba04C', pair: 'avax-usdt' },
    { to: '0xA362A10Ba6b59eE113FAa00e41E01C0087dd9BA1', pair: 'avax-wbtc' }

]
let pair = '0xe8acf438b10a2c09f80aef3ef2858f8e758c98f9';
let all_total = 0;

(async () => {
    for (var x = 0; x < strategies.length; x++) {
        let strategy = strategies[x];
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
                console.log(`${strategy.pair} png price:`, png_price, 'add to:', addto, 'date:', new Date(parseInt(swap.timestamp) * 1000).toLocaleDateString())
                total += addto                
            }
        }    
        console.log(`${strategy.pair} total:`, total)
        all_total += total
    }    
    console.log('all total:', all_total)
})();
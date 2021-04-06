const { request, gql } = require('graphql-request');

// first is proxied in case you f' up and get cloudflared 
//const endpoint = 'https://beta.scewpt.com/subgraphs/name/dasconnor/pangolindex'  
const endpoint = 'https://graph.yetiswap.app/subgraphs/name/yetiswap/yetiswap2'
//const endpoint = 'https://graph-node.avax.network/subgraphs/name/dasconnor/pangolindex'

//const avax = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'
//const png = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'

const avaxusdtpairid = '0x9ee0a4e21bd333a6bb2ab298194320b8daa26516'
const avaxdaipairid = '0x17a2e8275792b4616befb02eb9ae699aa0dcb94b'
const pngdaipairid = '0xd765b31399985f411a9667330764f62153b42c76'
const pngusdtpairid = '0xe8acf438b10a2c09f80aef3ef2858f8e758c98f9'

const yts_avaxusdtpairid = '0x6c2038f09212dac0ad30be822f0eecfb29064814'

const pricequoteusdtpairql = gql`query getPair($pairId: String!) {
    pair(id: $pairId) {
        id
        token0Price
        token0 {
          symbol
          
        }
        token1Price
        token1 {
          symbol
        }    
    }
}`;

[yts_avaxusdtpairid].forEach(stablepair => {
    request(endpoint, pricequoteusdtpairql, { pairId: stablepair }).then(response => {
        console.log('response:', response);
        console.log(`${response.pair.token0.symbol}:`, response.pair.token0Price, `${response.pair.token1.symbol}:`, response.pair.token1Price);
    });    
})


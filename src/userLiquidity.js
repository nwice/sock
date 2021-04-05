const { request, gql } = require('graphql-request');

const endpoint = 'https://graph-node.avax.network/subgraphs/name/dasconnor/pangolindex'

const query_block = gql`query getUser($userId: String!) {
    user(id: $userId) {
      liquidityPositions {
        id
        pair {
          totalSupply
          reserveUSD
          token0 {
              symbol
          }
          token1 {
            symbol
          }          
        }
        liquidityTokenBalance
      }      
    } 
}`;

const userLiquidity = async (account, symbol0, symbol1) => {
    request(endpoint, query_block, { userId: account }).then(response => {        
        let lp = response.user.liquidityPositions.filter(lp => {
            return [symbol0, symbol1].includes(lp.pair.token0.symbol) && [symbol0, symbol1].includes(lp.pair.token1.symbol)
        })[0] 
        return lp.pair.totalSupply / lp.liquidityTokenBalance * lp.pair.reserveUSD
    });
}

export { userLiquidity };
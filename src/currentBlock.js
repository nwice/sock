const { request, gql } = require('graphql-request');

const endpoint = 'https://graph-node.avax.network/subgraphs/name/dasconnor/pangolindex'

const query_block = gql`{
  liquidityPositionSnapshots(orderBy:block, orderDirection: desc, first: 1) {
    block
  }
}`;

request(endpoint, query_block, {}).then(response => {
  let current_block = response.liquidityPositionSnapshots[0].block;
  console.log('current block:', current_block);
});    

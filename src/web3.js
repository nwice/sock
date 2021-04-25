import Web3 from 'web3'
const web3 = new Web3(Web3.givenProvider || 'wss://api.avax.network/ext/bc/C/ws');

export { web3 }

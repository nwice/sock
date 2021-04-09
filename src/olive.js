var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'wss://api.avax.network/ext/bc/C/ws');

var tokenABI = [{ 
    "constant": true, 
    "inputs": [{ "name": "_owner", "type": "address" }], 
    "name": "balanceOf", 
    "outputs": [{ "name": "balance", "type": "uint256" }], 
    "payable": false, 
    "type": "function" 
}];

let lp = '0xF54a719215622f602FCA5BF5a6509734C3574a4c'

let usdt = '0xde3a24028580884448a5397872046a019649b084';
let olive = '0x617724974218a18769020a70162165a539c07e8a';

Promise.all([
    new web3.eth.Contract(tokenABI, usdt).methods.balanceOf(lp).call().then( result => {
        return result;
    }),
    new web3.eth.Contract(tokenABI, olive).methods.balanceOf(lp).call().then( result => {
        return result;
    })    
]).then(result => {
    console.log('olive price:', result[0] / result[1] * 1e12  )
})

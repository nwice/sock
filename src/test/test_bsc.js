import { bsc as web3 } from './web3.js'
import { abi_erc20 } from './abi/abi_erc20.js'

let contract = new bsc.eth.Contract(abi_erc20, '0x33a3d962955a3862c8093d1273344719f03ca17c'.toLowerCase());
contract.methods.burned().call().then(result => {
    console.log(result)
})
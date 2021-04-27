import { ava as web3 } from './web3.js'
import { abi_erc20 } from './abi/abi_erc20.js'

let contract = new web3.eth.Contract(abi_erc20, '0x6e7f5C0b9f4432716bDd0a77a3601291b9D9e985'.toLowerCase());

console.log( web3.utils.toChecksumAddress('0x0000000') );

contract.methods.balanceOf('0x0000000').call().then(result => {
    console.log(result)
})
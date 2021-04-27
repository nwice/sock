import { bsc, ava } from './../web3.js';
import { tokens, dexes } from './../statemachine.js'
import { find_token, pair_contains, pairnick } from './../util.js'
import { abi_erc20 } from './../abi/abi_erc20.js'
import { dexprices } from './../price.js'

const pricefirst = async () => {
    await dexprices(dexes.filter(d => d.symbol.toLowerCase() === 'png'))
    let spore = find_token(tokens, {key:'symbol', value: 'spore'})
    let bscBurned = await new bsc.eth.Contract(abi_erc20, spore.bsc).methods.burned().call()
    let avaBurned = await new ava.eth.Contract(abi_erc20, spore.id).methods.balanceOf('0x000000000000000000000000000000000000dEaD').call()
    spore.bscBurned = bscBurned / 1e18  
    spore.avaBurned = avaBurned / 1e18
    spore.circulatingSupply = spore.totalSupply - spore.avaBurned - spore.bscBurned; // - spore.totalFees / 2
    console.log(spore)    
    let totalspore = 0
    dexes.filter(d => d?.pairs).map(dex => {
        dex.pairs.filter(p => { return pair_contains(p, spore)} ).forEach(p => {
            console.log(`${dex.symbol.toLowerCase().padStart(8, ' ')} ${pairnick(p).padStart(14, ' ')} locked:`.padEnd(5, ' '), p.locked)
            totalspore += p.locked
        })
    })
    console.log('')
    console.log(`total spore locked:`.padStart(31, ' '), totalspore)
}

pricefirst().then(res => {
    console.log('done')
})




import { bsc, ava } from './../web3.js';
import { tokens, dexes } from './../statemachine.js'
import { find_token, pair_contains, pairnick } from './../util.js'
import { abi_erc20 } from './../abi/abi_erc20.js'
import { dexprices } from './../price.js'
import { versioning, upload } from './../versioning.js';
import { exit } from 'process';

const pricefirst = async () => {
    await dexprices(dexes.filter(d => d.symbol.toLowerCase() === 'png'))
    let spore = find_token(tokens, {key:'symbol', value: 'spore'})
    let bscBurned = await new bsc.eth.Contract(abi_erc20, spore.bsc).methods.burned().call()
    let avaBurned = await new ava.eth.Contract(abi_erc20, spore.id).methods.balanceOf(spore.avaburn).call()
    console.log(spore)
    let report = {
        bscBurned: bscBurned / 10 ** spore.decimals,
        avaBurned: avaBurned / 10 ** spore.decimals,
        locked: 0,
        pairs: []
    }

    report.circulatingSupply = spore.totalSupply - report.avaBurned - report.bscBurned; // - spore.totalFees / 2

    dexes.filter(d => d?.pairs).map(dex => {
        dex.pairs.filter(p => { return pair_contains(p, spore)} ).forEach(p => {
            console.log(`${dex.symbol.toLowerCase().padStart(8, ' ')} ${pairnick(p).padStart(14, ' ')} locked:`.padEnd(5, ' '), p.locked)
            report.locked += p.locked
            report.pairs.push(p)
        })
    })    

    let report_spore = Object.assign({}, spore.prices.filter(p => p.dex === 'png')[0], report)

    delete spore.prices

    Object.assign(spore, report_spore)

    versioning(spore, `dex/${spore.id.toLowerCase()}/tvl.json`.toLowerCase() )

    await upload({
        Bucket: 'beta.scewpt.com',
        Key: `spore/circulating`,
        Body: spore.circulatingSupply.toFixed(2),
        ContentType: 'text/plain',
        ACL: 'public-read',
    })

    let o = { circulating: spore.circulatingSupply.toFixed(2), total: spore.totalSupply }
    
    await upload({
        Bucket: 'powder.network',
        Key: `supply/spore.json`,
        Body: JSON.stringify(o),
        ContentType: 'application/json',
        ACL: 'public-read',
    })    
   
}

pricefirst().then(res => {
    console.log('done')
    setTimeout( () => {
        exit()
    }, 1000)
})


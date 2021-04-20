import { dexes } from './statemachine.js';
import { getversion, getcurrent, versioning } from './versioning.js';
import { exit } from 'process';

let strategies = dexes.snob.tvl.pairs.filter(p => { return p.strategy !== undefined})

let all_strategies = [...strategies,...dexes.snob.legacy]

Promise.all(all_strategies.map(async pair => {
    console.log('pair:', pair.strategy)
    let harvests = []
    let now = await getcurrent(`dex/0xc38f41a296a4493ff429f1238e030924a1542e50/harvest/${pair.strategy.toLowerCase()}.json`)
    if ( now.json !== undefined ) {
        harvests.push(now.json)
        let previous = now.version - 1;
        console.log('previous:', previous)
        while (previous > 0) {
            let p = await getversion(`dex/0xc38f41a296a4493ff429f1238e030924a1542e50/harvest/${pair.strategy.toLowerCase()}.json`, previous)
            harvests.push(p)
            previous -= 1;        
        }    
    }
    let total = 0;
    harvests.forEach(h => {
        total += h.claim.amountUSD
    })
    if ( pair.single ) {
        total = total * 2
    }    
    return { strategy: pair.strategy.toLowerCase(), total: total }
})).then(res => {
    console.log('harvests:', res.length)
    let harvests = { total: 0.0 }
    res.forEach(r => {
        harvests[r.strategy] = r.total
        harvests.total += r.total
    })
    //versioning(harvests, `dex/0xc38f41a296a4493ff429f1238e030924a1542e50/harvest/total.json`)    
    setTimeout( () => {
        exit()
    },1000)
})
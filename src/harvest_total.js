import { dexes, tokens } from './statemachine.js';
import { getversion, getcurrent } from './versioning.js';

Promise.all(dexes.snob.strategies.map(async strategy => {
    let harvests = []
    let now = await getcurrent(`dex/snob/harvest/${strategy.id.toLowerCase()}.json`)
    harvests.push(now.json)
    let previous = now.version - 1;
    while (previous > 0) {
        let p = await getversion(`dex/snob/harvest/${strategy.id.toLowerCase()}.json`, previous)
        harvests.push(p)
        previous -= 1;        
    }
    let total = 0;
    harvests.forEach(h => {
        total += h.claim.amountUSD
    })
    if ( strategy.single ) {
        total = total * 2
    }    
    console.log(strategy.nickname, 'total:', total)
    return total
})).then(res => {
    console.log('total:', res.reduce((a, b) => a + b, 0))
})

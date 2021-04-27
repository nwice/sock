import { find_token, refuse } from './util.js';
import { tokens, dexes } from './statemachine.js';
import { dexprices } from './price.js';
import { versioning, upload } from './versioning.js';
import { exit } from 'process';

const price_different = (p, previous) => {
  if ( p.price === previous.price ) {
    return false
  }
  return true
}

const any_price_different = (all, all_previous) => {
  if ( all.length === all_previous.length ) {
    return all.map(p => {
      let changed = false;
      let compare_to = all_previous.filter(previous => { return previous.id === p.id && previous.dex === p.dex })[0]
      if ( compare_to === undefined ) {
        console.log('missing:', p.symbol, 'to:', p.price)        
        changed = true;
      } else if ( compare_to.price !== p.price ) {
        console.log('change:', p.symbol, 'to:', p.price, 'from:', compare_to?.price)
        changed = true;
      }
      return { changed, p, compare_to}
    }).filter(b => b.changed).length === 0 ? false : true;    
  }
  return true
}

const savesupply = async () => {  

  let snob = find_token(tokens, {key:'symbol', value: 'snob'})
  console.log(snob)
  await upload({
      Bucket: 'beta.scewpt.com',
      Key: `snob/circulating`,
      Body: snob.totalSupply.toFixed(2),
      ContentType: 'text/plain',
      ACL: 'public-read',
  })
  let o = { circulating: parseFloat(snob.totalSupply.toFixed(2)), total: 18000000 }
  await upload({
      Bucket: 'powder.network',
      Key: `supply/snob.json`,
      Body: JSON.stringify(o),
      ContentType: 'application/json',
      ACL: 'public-read',
  })

  return snob.totalSupply.toFixed(2)
}

const savetvl = async () => {
  await dexprices(dexes)
  let tp = find_token(tokens, { key: 'symbol', value: 'snob'}).prices.filter(p => { return p.dex === 'png' })[0];  
  let dex = find_token(dexes, { key: 'symbol', value: 'snob'})
  dex.tvl.locked = dex.tvl.pairs.map(p => {
    return p.locked 
  }).reduce( (a,b) => a + b, 0)  
  dex.tvl.pairs.forEach(p => {
    Object.keys(p).filter(k => { return k.startsWith('token')}).map(key => {
      delete p[key].prices
    })
  })

  
  upload({
    Bucket: 'beta.scewpt.com',
    Key: `snob/tvl`,
    Body: dex.tvl.locked.toFixed(2),
    ContentType: 'text/plain',
    ACL: 'public-read',
  })
  
  
  let o = Object.assign({}, tp, dex.tvl)
  versioning(o, `dex/${dex.id.toLowerCase()}/tvl.json`)
  return true
}

const saveprice = async () => {
    let prices = await dexprices(dexes)
    console.log('prices length:', prices)

    let publishable = prices.filter(p => {   
      return p.tradeVolume > 0 && !refuse.map(msi => msi.toLowerCase()).includes(p.id.toLowerCase())      
    });

    console.log('publishable:', publishable.length)
    
    publishable.forEach(async (p) => {    
      if ( p.symbol.toLowerCase() === 'snob' && p.dex.toLowerCase() === 'png' ) {
        upload({
          Bucket: 'beta.scewpt.com',
          Key: `snob/price`,
          Body: '' + p.price,
          ContentType: 'text/plain',
          ACL: 'public-read',
        })
      }
      let dextoken = find_token(tokens, { key: 'symbol', value: p.dex})
      versioning(p, `dex/${dextoken.id.toLowerCase()}/price/${p.id.toLowerCase()}.json`.toLowerCase(), price_different)
    })
    return prices;
}

const commands = { price: saveprice, tvl: savetvl, supply: savesupply }

if ( process.argv.length > 2 && Object.keys(commands).includes(process.argv[2]) ) {
    let command = process.argv[2];
    console.log('running command:', command)
    await commands[command]().then(res => {
        console.log('command complete:', command, 'result:', res)
        setTimeout( () => {
            console.log('exit')
            exit()        
        }, 2000)        
    })
}


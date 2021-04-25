import { tokens } from './statemachine.js'
import { upload } from './versioning.js';
import { exit } from 'process';

Object.keys(tokens).map(k => { return { token_name: k, token: tokens[k] }}).forEach(t => {
   if ( t.token_name === 'snob') {
      console.log('token:', t.token.symbol, 'circulating supply:', t.token.totalSupply)
      upload({
         Bucket: 'beta.scewpt.com',
         Key: `snob/circulating`,
         Body: t.token.totalSupply.toFixed(2),
         ContentType: 'text/plain',
         ACL: 'public-read',
     })
     let o = { circulating: parseFloat(t.token.totalSupply.toFixed(2)), total: 18000000 }
     upload({
         Bucket: 'powder.network',
         Key: `supply/snob.json`,
         Body: JSON.stringify(o),
         ContentType: 'application/json',
         ACL: 'public-read',
     })
     setTimeout( () => {
      exit()
     }, 2000)
   }
});
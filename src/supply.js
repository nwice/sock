import { tokens } from './statemachine.js'
import { upload } from './versioning.js';
import { exit } from 'process';

Object.keys(tokens).map(k => { return { token_name: k, token: tokens[k] }}).forEach(t => {
   if ( t.token_name === 'snob') {
      console.log('token:', t.token.symbol, 'circulating supply:', t.token.totalSupply)
      let promise = upload({
         Bucket: 'beta.scewpt.com',
         Key: `snob/circulating`,
         Body: t.token.totalSupply.toFixed(2),
         ContentType: 'text/plain',
         ACL: 'public-read',
     })
     console.log('promise:', promise);
     setTimeout( () => {
      exit()
     }, 2000)
   }
});
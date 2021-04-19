import { tokens } from './statemachine.js'

Object.keys(tokens).map(k => { return tokens[k] }).forEach(t => {
   console.log('token:', t.symbol, 'circulating supply:', t.totalSupply)
});
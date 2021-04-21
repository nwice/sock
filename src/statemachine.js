import Web3 from 'web3'
import fs from 'fs';
import { tokens, dexes } from './state.js'
import { dex_avaxprice } from './util.js'
import { dexpairs } from './graph.js'
import { exit } from 'process';

const abi = JSON.parse(fs.readFileSync('public/abi.json'));
const web3 = new Web3(Web3.givenProvider || 'wss://api.avax.network/ext/bc/C/ws');

const populate = (token) => {
    return Promise.all([
        new web3.eth.Contract(abi, token.id).methods.name().call().then( result => {
            token['name'] = result
        }),
        new web3.eth.Contract(abi, token.id).methods.symbol().call().then( result => {
            token['symbol'] = result
        }),
        new web3.eth.Contract(abi, token.id).methods.totalSupply().call().then( result => {
            token['totalSupply'] = result / 1e18
        }).catch(err => {
            console.log('no supply:', err)
        }),        
        new web3.eth.Contract(abi, token.id).methods.owner().call().then( result => {
            token['owner'] = result
        }).catch(err => {
            //console.log('no owner:', err)            
        })
    ])
}

const external = await Promise.all(Object.keys(tokens).map(k => { return tokens[k]}).map(async (token) => {
    return populate(token)
})).then(async (populated_tokens) => {
    
    //console.log('tokens populated:', populated_tokens.length)
    
    const internal = Object.keys(dexes).map(k => { 
        Object.assign(dexes[k], tokens[k])
        return { dex_name: k, dex: dexes[k] }
    });

    let system = await Promise.all(internal.filter(d => { return (d.dex.amm === undefined || d.dex.amm !== false) && d.dex.graphql !== undefined }).map(d => {        
        console.log('dex:', d.dex_name)
        return dexpairs(d.dex).then(pairs => {
            //console.log('dex:', d.dex_name, 'pairs length:', pairs.length)
            d.dex.pairs = pairs
            let avaxprice = dex_avaxprice(d)[2]
            let tvllocked = d.dex.pairs.map(pair => {
                
                pair.locked = parseFloat(pair.reserveETH) * avaxprice
                return pair.locked
            }).reduce((a, b) => a + b, 0)
            console.log('tvl locked:', tvllocked, 'dex:', d.dex_name)
            return tvllocked
        }).then(res => {
            return res
        })        
    }));
    let system_tvl = system.reduce( (a, b) => { return a + b }, 0)
    console.log('system tvl:', system_tvl)

    await Promise.all(internal.filter(d => d.dex?.tvl?.account !== undefined).map(async (dex_obj) => {
        let account = dex_obj.dex.tvl.account
        let avaxprice = dex_avaxprice(dex_obj)[2]
        Promise.all(dex_obj.dex.pairs.map(async (pair) => {
            return new web3.eth.Contract(abi, pair.id).methods.balanceOf(account.id).call().then( result => {
                let lv = avaxprice * result / 1e18
                //console.log(`${dex_obj.dex_name} locked value:`, lv, 'token0:', pair.token0.symbol, 'token1:', pair.token1.symbol, 'account:', account.id)
                return lv
            })
        })).then(totals => {
            account.locked = totals.reduce((a, b) => a + b, 0)
            //console.log(`${dex_obj.dex_name} account locked:`, account.locked)
        })
    }));

    await Promise.all(internal.filter(d => d.dex?.tvl?.pairs !== undefined).map(async (dex_obj) => {
        await Promise.all(dex_obj.dex.tvl.pairs.map(async pair => {
            if ( pair.token0 === undefined ) {
                Object.assign(pair, dexes[pair.dex].pairs.filter(p => { return p.id.toLowerCase() === pair.id.toLowerCase() })[0]);
            }            
            let avaxprice = dex_avaxprice({ dex_name: pair.dex, dex: dexes[pair.dex]})[2]
            return Promise.all(pair.accounts.map(account=> {                
                if (['compound', 'stake'].includes(account.account_type) ) {                    
                    
                    return new web3.eth.Contract(abi, account.id).methods.balanceOf(pair.strategy).call().then( result => {                        
                        account.locked = result / 1e18 / parseFloat(pair.totalSupply) * parseFloat(pair.reserveETH) * avaxprice
                        return account
                    }).catch(err => {
                        console.log(err)
                        exit()                        
                    });                                        
                } else if (['balance'].includes(account.account_type) ) {
                    return new web3.eth.Contract(abi, pair.id).methods.balanceOf(account.id).call().then( result => {
                        account.locked = account.avax ? result / 1e18 / parseFloat(pair.totalSupply) * parseFloat(pair.reserveETH) * avaxprice :  result / 1e18
                        return account
                    }).catch(err => {
                        console.log(err)
                        exit()                        
                    })
                }
            })).then(account_results => {
                let al = account_results.map(ar => { return ar.locked }).reduce((a, b) => a + b, 0);
                pair.locked = al;                
                console.log('pair locked:', al, 'nic:', pair.nickname)
                return pair
            });    
        })).then(pair_results => {
            let dl = pair_results.map(p => p.locked).reduce((a, b) => a + b, 0);
            console.log('dex lock:', dl)
            dex_obj.dex.locked = dl            
        });        
    }));
    return internal
})

export { tokens, dexes, web3 }
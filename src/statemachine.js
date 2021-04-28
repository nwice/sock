
import { tokens, dexes } from './state.js'
import { dex_avaxprice, pair_contains, find_token, pairnick } from './util.js'
import { dexpairs } from './graph.js'
import { ava as web3 } from './web3.js'
import { abi_erc20 } from './abi/abi_erc20.js'
import { exit } from 'process';


const populate = (token) => {
    return Promise.all([
        new web3.eth.Contract(abi_erc20, token.id).methods.totalSupply().call().then( result => {
            return parseInt(result)
        }).catch(err => {
            console.log('no supply:', err)
        }),
        new web3.eth.Contract(abi_erc20, token.id).methods.decimals().call().then( result => {
            token.decimals = parseInt(result)
        }).catch(err => {
            console.log('no decimals:', err)
        }),        
        new web3.eth.Contract(abi_erc20, token.id).methods.name().call().then( result => {
            token.name = result
        }),
        new web3.eth.Contract(abi_erc20, token.id).methods.symbol().call().then( result => {
            token.symbol = result
        }),
        new web3.eth.Contract(abi_erc20, token.id).methods.owner().call().then( result => {
            token.owner = result
        }).catch(err => {
            //console.log('no owner:', err)            
        }),
        new web3.eth.Contract(abi_erc20, token.id).methods.totalFees().call().then( result => {            
            token.totalFees = result / 1e18
        }).catch(err => {
            //console.log('no total fees:', err)            
        })        
    ]).then(results => {
        if ( token.decimals !== 18 ) {
            console.log(token.symbol, 'decimals:', token.decimals)
        }
        token.totalSupply = results[0] / 10 ** token.decimals
        return token
    })
}

const external = await Promise.all(Object.keys(tokens).map(k => { return tokens[k]}).map(async (token) => {
    return populate(token)
})).then(async (populated_tokens) => {
    
    dexes.forEach(d => {
        Object.assign(d, populated_tokens.filter(t => t.id.toLowerCase() === d.id.toLowerCase())[0])
    })
    
    let system = await Promise.all(dexes.filter(d => { return (d.amm === undefined || d.amm !== false) && d.graphql !== undefined }).map(dex => {        
        console.log('dex:', dex.symbol.toLowerCase())
        return dexpairs(dex).then(pairs => {
            dex.pairs = pairs
            let avaxprice = dex_avaxprice(dex)[2]
            //console.log(dex.symbol.toLowerCase(), 'avaxprice:', avaxprice)
            let tvllocked = dex.pairs.map(pair => {                
                pair.locked = parseFloat(pair.reserveETH) * avaxprice
                return pair.locked
            }).reduce((a, b) => a + b, 0)
            return tvllocked
        }).then(res => {
            return res
        })        
    }));
    let system_tvl = system.reduce( (a, b) => { return a + b }, 0)
    console.log('system tvl:', system_tvl)

    /*
    await Promise.all(dexes.filter(d => d?.watch !== undefined).map(async (dex) => {        
        let avaxprice = dex_avaxprice(dex)[2]
        return Promise.all(Object.keys(dex.watch).map(key => {
            let account = dex.watch[key]
            return Promise.all(dex.pairs.map(async (pair) => {
                return new web3.eth.Contract(abi_erc20, pair.id).methods.balanceOf(account.id).call().then( result => {                    
                    let t0 = find_token(tokens, { key: 'id', value: pair.token0.id })
                    let t1 = find_token(tokens, { key: 'id', value: pair.token1.id })
                    let divider = 1e18
                    if ( t0?.decimals === 9 || t1?.decimals === 9 ) {
                        divider = 1e21
                    }
                    let lv = avaxprice * result / divider
                    console.log('pair:', pairnick(pair), 'locked value:', lv, 'id:', pair.id)
                    return lv
                })
            })).then(totals => {
                account.locked = totals.reduce((a, b) => a + b, 0)                
                return account.locked
            })
        })).then(results => {
            dex.watch.locked = results.reduce((a, b) => a + b, 0)
            //console.log('dex watch:', dex.symbol.toLowerCase(), 'dex watch:', dex.watch.locked)
        })
    }));
    */
   
    await Promise.all(dexes.filter(d => d?.tvl?.pairs).map(async (dex) => {
        await Promise.all(dex.tvl.pairs.map(async pair => {
            let pairdex = dexes.filter(d => d.symbol.toLowerCase() == pair.dex.toLowerCase())[0]
            if ( pair.token0 === undefined ) {                
                Object.assign(pair, pairdex.pairs.filter(p => { return p.id.toLowerCase() === pair.id.toLowerCase() })[0])
            } else {
                Object.keys(pair).filter(k => k.startsWith('token') && k.length === 6).map(key => {
                    Object.assign(pair[key], populated_tokens.filter(t => t.id.toLowerCase() === pair[key].id.toLowerCase())[0])
                })
            }
            let avaxprice = dex_avaxprice(pairdex)[2]            
            return Promise.all(pair.accounts.map(account=> {                
                if (['compound', 'stake'].includes(account.account_type) ) {                                        
                    return new web3.eth.Contract(abi_erc20, account.id).methods.balanceOf(pair.strategy).call().then( result => {                        
                        account.locked = result / 1e18 / parseFloat(pair.totalSupply) * parseFloat(pair.reserveETH) * avaxprice
                        return account
                    }).catch(err => {
                        console.log(err)
                        exit()                        
                    });                                        
                } else if (['balance'].includes(account.account_type) ) {
                    return new web3.eth.Contract(abi_erc20, pair.id).methods.balanceOf(account.id).call().then( result => {
                        account.locked = account.avax ? result / 1e18 / parseFloat(pair.totalSupply) * parseFloat(pair.reserveETH) * avaxprice :  result / 1e18
                        return account
                    }).catch(err => {
                        console.log(err)
                        exit()                        
                    })
                } else if (['tokens'].includes(account.account_type) ) {
                    return Promise.all(Object.keys(pair).filter(k => k.startsWith('token') && k.length === 6).map(key => {
                        let divider = 10 ** pair[key].decimals                        
                        return new web3.eth.Contract(abi_erc20, pair[key].id).methods.balanceOf(account.id).call().then( result => {
                            return account.avax ? result / divider / parseFloat(pair.totalSupply) * parseFloat(pair.reserveETH) * avaxprice :  result / divider
                        }).catch(err => {
                            console.log(err)
                            exit()                        
                        })
                    })).then(results => {
                        account.locked = results.reduce((a, b) => a + b, 0);
                        return account
                    })                    
                }
            })).then(account_results => {
                let al = account_results.map(ar => { return ar.locked }).reduce((a, b) => a + b, 0);
                pair.locked = al;                
                return pair
            });    
        })).then(pair_results => {
            let dl = pair_results.map(p => p.locked).reduce((a, b) => a + b, 0);
            console.log('dex lock:', dl)
            dex.locked = dl            
        });        
    }));
    return dexes
})

export { tokens, dexes }
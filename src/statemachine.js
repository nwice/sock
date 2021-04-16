import Web3 from 'web3'
import fs from 'fs';
import { dexpairs, userliquidity } from './graph.js'

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
        new web3.eth.Contract(abi, token.id).methods.owner().call().then( result => {
            token['owner'] = result
        }).catch(err => {
            //console.log('no owner:', err)
            return;
        })
    ])
}

const tokens = {
    snob: {
        id: '0xC38f41A296A4493Ff429F1238e030924A1542e50',
    },
    png: {
        id: '0x60781C2586D68229fde47564546784ab3fACA982',
    },
    wavax: {
        id: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    },
    olive: {
        id: '0x617724974218A18769020A70162165A539c07E8a',
    },
    wbtc: {
        id: '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB',
    },
    eth: {
        id: '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15',
    },
    usdt: {
        stable: true,
        id: '0xde3a24028580884448a5397872046a019649b084'
    },
    dai: {
        stable: true,
        id: '0xba7deebbfc5fa1100fb055a87773e1e99cd3507a'
    },
    busd: {
        stable: true,
        id: '0xaeb044650278731ef3dc244692ab9f64c78ffaea'
    },
    link: {
        id: '0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651',
    },
    pefi: {
        id: '0xe896CDeaAC9615145c0cA09C8Cd5C25bced6384c',
    },
    sushi: {
        id: '0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc',
    },
    uni: {
        id: '0xf39f9671906d8630812f9d9863bbef5d523c84ab'
    },
    aave: {
        id: '0x8cE2Dee54bB9921a2AE0A63dBb2DF8eD88B91dD9'
    },
    yfi: {
        id: '0x99519AcB025a0e0d44c3875A4BbF03af65933627'
    },
    yts: {
        id: '0x488F73cddDA1DE3664775fFd91623637383D6404'
    },
    elk: {
        id: '0xE1C8f3d529BEa8E3fA1FAC5B416335a2f998EE1C'
    },
    com: {
        id: '0x3711c397B6c8F7173391361e27e67d72F252cAad'
    },
    zero: {
        id: '0x008E26068B3EB40B443d3Ea88c1fF99B789c10F7'
    },
    bamboo: {
        id: '0x9a928D7dcD8D7E5Cb6860B7768eC2D87B8934267'
    },
    shit: {
        id: '0x54b17F4f55bd93EfBe5f91a3A4619619bC7DBC33'
    },
    spore: {
        id: '0x6e7f5C0b9f4432716bDd0a77a3601291b9D9e985'
    }
};

// token0: tokens.usdt, token1: tokens.dai, token2: tokens.busd,

const conor = 'https://graph-node.avax.network/subgraphs/name/dasconnor/pangolindex'
const me = 'https://pango-info.scewpt.com/subgraphs/name/dasconnor/pangolindex'

const png_usdt_pair = '0xe8acf438b10a2c09f80aef3ef2858f8e758c98f9'

const dexes = {
    snob: Object.assign({ amm: false }, tokens.snob, {
        tvl: { 
            pairs: [
            {
                id: '0xdE1A11C331a0E45B9BA8FeE04D4B51A745f1e4A4', 
                dex: 'png',
                accounts: [{ id: '0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375', account_type: 'balance'}]                 
            },            
            {
                id: '0x7a6131110b82dacbb5872c7d352bfe071ea6a17c', 
                dex: 'png',
                accounts: [{ id: '0x39be35904f52e83137881c0ac71501edf0180181', account_type: 'pool'}]
            },            
            {
                id: '0x9EE0a4E21bd333a6bb2ab298194320b8DaA26516', 
                dex: 'png',
                accounts: [
                    { id: '0x3fcFBCB4b368222fCB4d9c314eCA597489FE8605', account_type: 'pool'},
                    { id: '0x74db28797957a52a28963f424daf2b10226ba04c', account_type: 'stake'}
                ]
            },
            {
                id: '0xbbC7fFF833D27264AaC8806389E02F717A5506c9', 
                dex: 'png',
                accounts: [
                    { id: '0x00933c16e06b1d15958317C2793BC54394Ae356C', account_type: 'pool'},
                    { id: '0x974Ef0bDA58C81F3094e124f530eF34fe70dc103', account_type: 'stake'}
                ]
            },
            {
                id: '0x1aCf1583bEBdCA21C8025E172D8E8f2817343d65', 
                dex: 'png',
                accounts: [
                    { id: '0x586554828eE99811A8ef75029351179949762c26', account_type: 'pool'},
                    { id: '0x953853590b805A0E885A75A3C786D2aFfcEEA3Cf', account_type: 'stake'}
                ]                
            },
            {
                id: '0xd7538cABBf8605BdE1f4901B47B8D42c61DE0367', 
                dex: 'png',
                accounts: [
                    { id: '0x621207093D2e65Bf3aC55dD8Bf0351B980A63815', account_type: 'pool'},
                    { id: '0x6a803904b9ea0fc982fbb077c7243c244ae05a2d', account_type: 'stake'}                    
                ]                
            },
            {
                id: '0xa1C2c3B6b120cBd4Cec7D2371FFd4a931A134A32', 
                dex: 'png',
                accounts: [
                    { id: '0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375', account_type: 'stake'}
                ]
            },
            {
                id: '0xd8b262c0676e13100b33590f10564b46eef652ad', 
                dex: 'png',
                accounts: [
                    { id: '0x751089F1bf31B13Fa0F0537ae78108088a2253BF', account_type: 'pool'},
                    { id: '0x14ec55f8B4642111A5aF4f5ddc56B7bE867eB6cC', account_type: 'stake'}
                ]
            }        
        ]},
        strategies: [
            { id: '0x974Ef0bDA58C81F3094e124f530eF34fe70dc103', priced: png_usdt_pair},
            { id: '0x6A803904b9eA0Fc982fBB077c7243c244Ae05a2d', priced: png_usdt_pair, single: true},
            { id: '0x953853590b805A0E885A75A3C786D2aFfcEEA3Cf', priced: png_usdt_pair},
            { id: '0x14ec55f8B4642111A5aF4f5ddc56B7bE867eB6cC', priced: png_usdt_pair},
            { id: '0x74dB28797957a52a28963F424dAF2B10226ba04C', priced: png_usdt_pair},
            { id: '0xA362A10Ba6b59eE113FAa00e41E01C0087dd9BA1', priced: png_usdt_pair}
        ],
        graphql: conor
    }),
    png: Object.assign({}, tokens.png, {
        graphql: conor
    }),
    elk: Object.assign({}, tokens.elk, {
        graphql: 'https://avax-graph.elk.finance/subgraphs/name/elkfinance/elkdex-avax'
    }),
    com: Object.assign({}, tokens.com, {
        graphql: 'https://graph.avagraph.live/subgraphs/name/complusnetwork/subgraph-ava'
    }),
    zero: Object.assign({}, tokens.zero, {
        graphql: 'https://zero-graph.0.exchange/subgraphs/name/zeroexchange/zerograph',
        stable: { id: '0x474Bb79C3e8E65DcC6dF30F9dE68592ed48BBFDb' }
    }), 
    olive: Object.assign({}, tokens.olive, {
        graphql: 'https://api.thegraph.com/subgraphs/name/olive-rose/olivecash',
        tvl: {
            account: {
                id: '0x5A9710f3f23053573301C2aB5024D0a43A461E80'
            }
        },
        tokens: [
            {
                pair: { id: '0xF54a719215622f602FCA5BF5a6509734C3574a4c' }, 
                token: tokens.olive
            }
        ]
    }),
    yts: Object.assign({}, tokens.yts, {
        tokens: [
            {
                pair: { id: '0xF1E800Ab9D0D1F6eaFf54E00Ad19710c41b154f2' }, 
                token: tokens.yts
            }
        ]
    })    
}

const get_price = (pair, find) => {
    return parseFloat(pair.token0.id.toLowerCase() === find.id.toLowerCase() ? pair.token0Price : pair.token1Price)
}

const pair_contains = (pair, find1, find2 ) => {
    return (pair.token0.id.toLowerCase() === find1.id.toLowerCase() || pair.token1.id.toLowerCase() === find1.id.toLowerCase()) && (pair.token0.id.toLowerCase() === find2.id.toLowerCase() || pair.token1.id.toLowerCase() === find2.id.toLowerCase())
}  

const dex_avaxprice = (dex) => {
    let base = dex.pairs.filter(avaxpair => {
        return pair_contains(avaxpair, tokens.wavax, dex.stable ? dex.stable : tokens.usdt)
    })[0];        
    let baseprice = get_price(
        base,
        dex.stable ? dex.stable : tokens.usdt
    )
    return baseprice
}

const alldexes = await Promise.all(Object.keys(tokens).map(k => { return tokens[k]}).map(async (token) => {
    return populate(token)
})).then(async (populated_tokens) => {
    
    console.log('tokens populated:', populated_tokens.length)
    
    const internal = Object.keys(dexes).map(k => { 
        Object.assign(dexes[k], tokens[k])
        return { dex_name: k, dex: dexes[k] }
    });

    await Promise.all(internal.filter(d => { return (d.dex.amm === undefined || d.dex.amm !== false) && d.dex.graphql !== undefined }).map(d => {        
        return dexpairs(d.dex).then(pairs => {
            console.log('dex:', d.dex_name, 'pairs length:', pairs.length)
            d.dex.pairs = pairs
            let avaxprice = dex_avaxprice(d.dex)
            let tvllocked = d.dex.pairs.map(pair => {
                pair.locked = parseFloat(pair.reserveETH) * avaxprice
                return pair.locked
            }).reduce((a, b) => a + b, 0)
            console.log('tvl locked:', tvllocked, 'dex:', d.dex_name)
        })
    }));

    await Promise.all(internal.filter(d => d.dex?.tvl?.account !== undefined).map(async (dex_obj) => {
        let account = dex_obj.dex.tvl.account
        let avaxprice = dex_avaxprice(dex_obj.dex)
        Promise.all(dex_obj.dex.pairs.map(async (pair) => {
            return new web3.eth.Contract(abi, pair.id).methods.balanceOf(account.id).call().then( result => {
                let lv = avaxprice * result / 1e18
                console.log('locked value:', lv, 'token0:', pair.token0.symbol, 'token1:', pair.token1.symbol)
                return lv
            })
        })).then(totals => {
            account.locked = totals.reduce((a, b) => a + b, 0)
            console.log('account locked:', account.locked)
        })
    }));

    await Promise.all(internal.filter(d => d.dex?.tvl?.pairs !== undefined).map(async (dex_obj) => {
        await Promise.all(dex_obj.dex.tvl.pairs.map(async pair => {
            if ( pair.token0 === undefined ) {
                Object.assign(pair, dexes[pair.dex].pairs.filter(p => { return p.id.toLowerCase() === pair.id.toLowerCase() })[0]);
            }            
            return Promise.all(pair.accounts.map(account=> {                
                if ( ['stake', 'pool'].includes(account.account_type) ) {                    
                    let avaxprice = dex_avaxprice(dexes[pair.dex])
                    return userliquidity(dex_obj.dex.graphql, account.id.toLowerCase(), pair.token1.symbol, pair.token0.symbol, avaxprice, account.account_type).then(av => {
                        account.locked = av;
                        return account
                    })                                       
                } else if ( ['balance'].includes(account.account_type) ) {
                    return new web3.eth.Contract(abi, pair.id).methods.balanceOf(account.id).call().then( result => {
                        account.locked = result / 1e18
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
            dex_obj.dex.locked = dl
        });        
    }));
    return internal
})

//console.log('tokens:', tokens)
console.log('snob:', JSON.stringify(dexes.snob, null, 2))

export { tokens, dexes, alldexes }
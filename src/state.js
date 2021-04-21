const tokens = {
    snob: {
        id: '0xC38f41A296A4493Ff429F1238e030924A1542e50',
        maxSupply: 18000000
    },
    png: {
        id: '0x60781C2586D68229fde47564546784ab3fACA982',
    },
    wavax: {
        id: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    },
    olive: {
        dex: 'olive',
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
        maxSupply: 21000000        
    },
    lyd: {
        id: '0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084'
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
        dex: 'yts',
        id: '0x488F73cddDA1DE3664775fFd91623637383D6404'
    },
    elk: {
        dex: 'elk',
        id: '0xE1C8f3d529BEa8E3fA1FAC5B416335a2f998EE1C'
    },
    com: {
        dex: 'com',
        id: '0x3711c397B6c8F7173391361e27e67d72F252cAad'
    },
    zero: {
        dex: 'zero',
        id: '0x008E26068B3EB40B443d3Ea88c1fF99B789c10F7'
    },
    bamboo: {
        id: '0x9a928D7dcD8D7E5Cb6860B7768eC2D87B8934267'
    },
    sfi: {
        id: '0x1f1fe1ef06ab30a791d6357fdf0a7361b39b1537'
    },    
    shit: {
        id: '0x54b17F4f55bd93EfBe5f91a3A4619619bC7DBC33'
    },
    spore: {
        id: '0x6e7f5C0b9f4432716bDd0a77a3601291b9D9e985'
    }
};

const pangolinql_old = 'https://graph-node.avax.network/subgraphs/name/dasconnor/pangolindex'
const pangolinql = 'https://api.thegraph.com/subgraphs/name/dasconnor/pangolin-dex'

const dexes = {
    snob: Object.assign({ amm: false }, tokens.snob, {
        tvl: { 
            pairs: [
                {
                    id: '0xde1a11c331a0e45b9ba8fee04d4b51a745f1e4a4', 
                    dex: 'png',
                    nickname: 's3d',
                    token0: tokens.usdt,
                    token1: tokens.dai,
                    token2: tokens.busd,
                    accounts: [{
                        id: '0xb12531a2d758c7a8bf09f44fc88e646e1bf9d375',
                        account_type: 'balance',
                        avax: false
                    }]                    
                },                
                {
                    nickname: 'wavax-wbtc',
                    id: '0x7a6131110b82dacbb5872c7d352bfe071ea6a17c', 
                    dex: 'png',
                    strategy: '0x2edC6522d658946fBA5116fFaA60d8760d1B21A8',
                    accounts: [{
                        id: '0xe968E9753fd2c323C2Fe94caFF954a48aFc18546',
                        account_type: 'compound'
                    }]                    
                },                
                {
                    nickname: 'wavax-usdt',
                    id: '0x9ee0a4e21bd333a6bb2ab298194320b8daa26516', 
                    dex: 'png',
                    strategy: '0x961890586dfB84919d8C6C5f6304192A2b3ddaB7',
                    accounts: [{
                        id: '0x94C021845EfE237163831DAC39448cFD371279d6',
                        account_type: 'compound'
                    }]                    
                },                
                {
                    nickname: 'wavax-link',
                    id: '0xbbc7fff833d27264aac8806389e02f717a5506c9', 
                    dex: 'png',
                    strategy: '0x846E79A9d8CCC6bBafc3939177a3D53E51C634FC',
                    accounts: [{
                        id: '0xBDa623cDD04d822616A263BF4EdbBCe0B7DC4AE7',
                        account_type: 'compound'
                    }]                    
                },                
                {
                    nickname: 'wavax-eth',
                    id: '0x1acf1583bebdca21c8025e172d8e8f2817343d65', 
                    dex: 'png',
                    strategy: '0x6b32266e7793359Fa199C32e950cF5c0EB4b284A',
                    accounts: [{
                        id: '0x417C02150b9a31BcaCb201d1D60967653384E1C6',
                        account_type: 'compound'
                    }]                    
                },                
                {
                    nickname: 'wavax-png',
                    id: '0xd7538cABBf8605BdE1f4901B47B8D42c61DE0367', 
                    dex: 'png',
                    strategy: '0x08d8C7C1a6E8543a4674E77cc0111EAa1D520f8b',
                    single: true,
                    accounts: [{
                        id: '0x574d3245e36Cf8C9dc86430EaDb0fDB2F385F829',
                        account_type: 'compound'
                    }]                    
                },                
                {
                    nickname: 'wavax-sushi',
                    id: '0xd8b262c0676e13100b33590f10564b46eef652ad', 
                    dex: 'png',
                    strategy: '0x1b4468dC172B94B7B8307ca5b1f63466b086acc8',
                    accounts: [{
                        id: '0xDA354352b03f87F84315eEF20cdD83c49f7E812e',
                        account_type: 'compound'
                    }]                    
                },                
                {
                    nickname: 'wavax-snob',
                    id: '0xa1c2c3b6b120cbd4cec7d2371ffd4a931a134a32', 
                    dex: 'png',
                    accounts: [{
                        id: '0xb12531a2d758c7a8bf09f44fc88e646e1bf9d375',
                        account_type: 'balance',
                        avax: true
                    }]                    
                },                
                {
                    nickname: 'sushi-png',
                    id: '0xf105fb50fc6ddd8a857bbecd296c8a630e8ca857', 
                    dex: 'png',
                    strategy: '0xdC3F53a364BE3b38d6f8e6a087f61cb2af58FC51',
                    single: true,
                    accounts: [{
                        id: '0x633F4b4DB7dD4fa066Bd9949Ab627a551E0ecd32',
                        account_type: 'compound'
                    }]
                },
                {
                    nickname: 'png-eth',
                    id: '0x53b37b9a6631c462d74d65d61e1c056ea9daa637', 
                    dex: 'png',
                    strategy: '0x9B3298Dba29A1Fc7061A4eF9b360eAa12879C911',
                    single: true,
                    accounts: [{
                        id: '0x7ac007afB5d61F48D1E3C8Cc130d4cf6b765000e',
                        account_type: 'compound'
                    }]
                },
                {
                    nickname: 'png-wbtc',
                    id: '0xf372ceae6b2f4a2c4a6c0550044a7eab914405ea', 
                    dex: 'png',
                    strategy: '0xafbA321B14A22501466d18eA0D9616f8e90Fc378',
                    single: true,
                    accounts: [{
                        id: '0x681047473B6145BA5dB90b074E32861549e85cC7',
                        account_type: 'compound'
                    }]                    
                },
                {
                    nickname: 'png-uni',
                    id: '0x874685bc6794c8b4befbd037147c2eef990761a9', 
                    dex: 'png',
                    strategy: '0x8eE25bdfe0B749B78157505B92bd919414Af696c',
                    single: true,
                    accounts: [{
                        id: '0x4f74BbF6859A994e7c309eA0f11E3Cc112955110',
                        account_type: 'compound'
                    }]
                },
                {
                    nickname: 'png-dai',
                    id: '0xd765b31399985f411a9667330764f62153b42c76', 
                    dex: 'png',
                    strategy: '0x53a6fFE10AdB8db0D861BF264134D42CAC03a1Bd',
                    single: true,
                    accounts: [{
                        id: '0xe3103e565cF96a5709aE8e603B1EfB7fED04613B',
                        account_type: 'compound'
                    }]
                },
                {
                    nickname: 'png-usdt',
                    id: '0xe8acf438b10a2c09f80aef3ef2858f8e758c98f9', 
                    dex: 'png',
                    strategy: '0xAF1F77739E87a1bDA1114e13d4aF86c8546f3996',
                    single: true,
                    accounts: [{
                        id: '0xE2510a1fCCCde8d2D1c40b41e8f71fB1F47E5bBA',
                        account_type: 'compound'
                    }]
                },
                {
                    nickname: 'png-link',
                    id: '0x7313835802c6e8ca2a6327e6478747b71440f7a4', 
                    dex: 'png',
                    strategy: '0xe11248e5c0a98038633603F291267b74183AB7be',
                    single: true,
                    accounts: [{
                        id: '0x6356b24b36074AbE2903f44fE4019bc5864FDe36',
                        account_type: 'compound'
                    }]
                },
                {
                    nickname: 'png-yfi',
                    id: '0xa465e953f9f2a00b2c1c5805560207b66a570093', 
                    dex: 'png',
                    strategy: '0x93bc576943Ef7452888dD810f502595Ee83187EE',
                    single: true,
                    accounts: [{
                        id: '0xc7D0E29b616B29aC6fF4FD5f37c8Da826D16DB0D',
                        account_type: 'compound'
                    }]
                },
                {
                    nickname: 'png-aave',
                    id: '0x0025cebd8289bbe0a51a5c85464da68cbc2ec0c4', 
                    dex: 'png',
                    strategy: '0x47F884e0bfC0e56eCDc581e2774efeC12874f7FD',
                    single: true,
                    accounts: [{
                        id: '0xFd9ACEc0F413cA05d5AD5b962F3B4De40018AD87',
                        account_type: 'compound'
                    }]
                }        
            ]
        },
        legacy: [
            { strategy: '0x974Ef0bDA58C81F3094e124f530eF34fe70dc103', nickname: 'avax-link'  },
            { strategy: '0x6A803904b9eA0Fc982fBB077c7243c244Ae05a2d', single: true, nickname: 'avax-png' },
            { strategy: '0x953853590b805A0E885A75A3C786D2aFfcEEA3Cf', nickname: 'avax-eth' },
            { strategy: '0x14ec55f8B4642111A5aF4f5ddc56B7bE867eB6cC', nickname: 'avax-sushi' },
            { strategy: '0x74dB28797957a52a28963F424dAF2B10226ba04C', nickname: 'avax-usdt' },
            { strategy: '0xA362A10Ba6b59eE113FAa00e41E01C0087dd9BA1', nickname: 'avax-wbtc' }
        ],        
        graphql: pangolinql
    }),
    png: Object.assign({}, tokens.png, {
        graphql: pangolinql
    }),
    pefi: Object.assign({amm: false}, tokens.pefi, {
        graphql: pangolinql
    }),
    lyd: Object.assign({ amm: false}, tokens.lyd, {
        graphql: pangolinql
    }),    
    elk: Object.assign({}, tokens.elk, {
        graphql: 'https://avax-graph.elk.finance/subgraphs/name/elkfinance/elkdex-avax'
    }),
    com: Object.assign({}, tokens.com, {
        graphql: 'https://graph.avagraph.live/subgraphs/name/complusnetwork/subgraph-ava'
    }),
	zero: Object.assign({ amm: false }, tokens.zero, {
        graphql: 'https://zero-graph.0.exchange/subgraphs/name/zeroexchange/zerograph',
        stable: { id: '0x474Bb79C3e8E65DcC6dF30F9dE68592ed48BBFDb' }
    }), 
    olive: Object.assign({}, tokens.olive, {
        graphql: 'https://api.thegraph.com/subgraphs/name/olive-rose/olivecash',
        tvl: {
            account: {
                id: '0x5A9710f3f23053573301C2aB5024D0a43A461E80'
            }
        }
    }),
    yts: Object.assign({}, tokens.yts, {
        graphql: 'https://api.thegraph.com/subgraphs/name/yetiswap/yetiswap',
    })    
}

export { dexes, tokens }

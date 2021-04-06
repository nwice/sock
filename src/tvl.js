const fs = require('fs');
const Web3 = require('web3');
const { request, gql } = require('graphql-request');
var AWS = require('aws-sdk');
const { exit } = require('process');
AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3();

const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
}

//const endpoint = 'https://beta.scewpt.com/subgraphs/name/dasconnor/pangolindex'
const endpoint = 'https://graph-node.avax.network/subgraphs/name/dasconnor/pangolindex'
const query_block = gql`query getUser($userId: String!) {
    user(id: $userId) {
      liquidityPositions {
        id
        pair {
          totalSupply
          reserveUSD
          token0 {
              symbol
          }
          token1 {
            symbol
          }          
        }
        liquidityTokenBalance
      }      
    } 
}`;
const userLiquidity = async (account, symbol0, symbol1, avaxprice) => {
    return request(endpoint, query_block, { userId: account.toLowerCase() }).then(response => {        
        if ( !response.user ) { return 0 }
        let lp = response.user.liquidityPositions.filter(lp => {
            return [symbol0, symbol1].includes(lp.pair.token0.symbol) && [symbol0, symbol1].includes(lp.pair.token1.symbol)
        })[0] 
        let mv = lp.liquidityTokenBalance / lp.pair.totalSupply * lp.pair.reserveUSD
        return mv * avaxprice
    });
}

let web3 = new Web3('ws://192.168.1.14:9650/ext/bc/C/ws');

var tokenABI = [{ 
    "constant": true, 
    "inputs": [{ "name": "_owner", "type": "address" }], 
    "name": "balanceOf", 
    "outputs": [{ "name": "balance", "type": "uint256" }], 
    "payable": false, 
    "type": "function" 
}];

var s3d = new web3.eth.Contract(tokenABI, '0xdE1A11C331a0E45B9BA8FeE04D4B51A745f1e4A4');

let load = [
    { symbol: 'wavax' }, { symbol: 'link' }, { symbol: 'eth' }, { symbol: 'png' }, { symbol: 'snob' }, 
    { symbol: 'sushi' }, { symbol: 'usdt' }, { symbol: 'dai' }, { symbol: 'wbtc' }
];

(async () => {     

    const players = await Promise.all(load.map(async (p) => {
        let data = await s3.getObject({
            Bucket: 'powder.network',
            Key: `dex/png/price/${p.symbol.toLowerCase()}.json`
        }).promise()
        let content = await data.Body.toString();
        let loaded_p = JSON.parse(content);

        return Object.assign({}, p, loaded_p)
    }));
    
    const player = (symbol) => {
        return players.filter(p => { return symbol.toLowerCase() == p.symbol.toLowerCase() })[0]
    }

    let new_tvl = Object.assign({
        pairs: [
            {
                contract: '0xdE1A11C331a0E45B9BA8FeE04D4B51A745f1e4A4',
                token0: player('usdt'), token1: player('dai'),
                accounts: [{ contract: '0xdE1A11C331a0E45B9BA8FeE04D4B51A745f1e4A4'}]                 
            },            
            {
                token0: player('wavax'), token1: player('wbtc'),
                accounts: [{ pool: '0x39BE35904f52E83137881C0AC71501Edf0180181'}]
            },            
            {
                token0: player('wavax'), token1: player('usdt'),
                accounts: [{ stake: '0x74db28797957a52a28963f424daf2b10226ba04c'}, {pool: '0x3fcFBCB4b368222fCB4d9c314eCA597489FE8605'}]
            },
            {
                token0: player('wavax'), token1: player('link'),
                accounts: [{ stake: '0x974Ef0bDA58C81F3094e124f530eF34fe70dc103'}, {pool: '0x00933c16e06b1d15958317C2793BC54394Ae356C'}]
            },
            {
                token0: player('wavax'), token1: player('eth'),
                accounts: [{ stake: '0x953853590b805A0E885A75A3C786D2aFfcEEA3Cf'}, {pool: '0x586554828eE99811A8ef75029351179949762c26'}]                
            },
            {
                token0: player('wavax'), token1: player('png'),
                accounts: [{ stake: '0x6a803904b9ea0fc982fbb077c7243c244ae05a2d'}, {pool: '0x621207093D2e65Bf3aC55dD8Bf0351B980A63815'}]
            },
            {
                token0: player('wavax'), token1: player('snob'),
                accounts: [{ stake: '0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375'}]
            },
            {
                token0: player('wavax'), token1: player('sushi'),
                accounts: [{ stake: '0x14ec55f8B4642111A5aF4f5ddc56B7bE867eB6cC'}, {pool: '0x751089F1bf31B13Fa0F0537ae78108088a2253BF'}]
            }        
        ]}, 
        player('snob'), { timestamp: new Date().getTime() }
    );

    new_tvl.pairs[0].token2 = {
        symbol: 'BUSD',
        id: '0xaeb044650278731ef3dc244692ab9f64c78ffaea'
    }

    console.log('step 1')

    let stablepair_uint = await s3d.methods.balanceOf('0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375').call()
    let stablepairlocked = stablepair_uint / 1e18    
    new_tvl.pairs[0].accounts[0].locked = stablepairlocked    
    new_tvl.pairs[0].locked = stablepairlocked

    let ap = player('wavax').price

    console.log('step 2')

    await sleep(1000)
    
    let tvl_sum = await Promise.all(new_tvl.pairs.filter(p => p.locked === undefined).map( async (pair) => {
        console.log('step 3')
        let pair_sum = await Promise.all(pair.accounts.filter(a => a.locked === undefined).map( async (account_type) => {
            let at = Object.keys(account_type)[0]
            let an = account_type[at]
            let av = await userLiquidity(an, pair.token0.symbol, pair.token1.symbol, ap)
            console.log('account:', an, 'value:', av)
            account_type.locked = av;
            return av;
        })).then(inner_resolve => {
            return inner_resolve.reduce((a, b) => a + b, 0)
        }).catch( inner_err => {
            console.log('inner err:', inner_err)    
        });
        pair.locked = pair_sum;
        return pair_sum;
    })).then(resolve => {
        return resolve.reduce((a, b) => a + b, 0)            
    }).catch( err => {
        console.log('err:', err)
    });

    console.log('step 3')
    tvl_sum += stablepairlocked
    Object.assign(new_tvl, { locked_value: tvl_sum, locked: tvl_sum })

    let write_out = JSON.stringify(new_tvl, null, 2);

    fs.writeFileSync(`public/tvl/${new_tvl.symbol.toLowerCase()}.json`, write_out);

    let increment_type = 'tvl'
    let increment_symbol = new_tvl.symbol.toLowerCase()
    let increment_out = write_out

    let s3object = {        
        Key:`${increment_type}/${increment_symbol}.json`,
        Bucket: 'powder.network',        
    }

    let nv = 0    
    try {
        let redirect = await s3.headObject(s3object).promise()    
        console.log('redirect', redirect)    
        nv = parseInt(redirect.WebsiteRedirectLocation.split('/').pop().split('.')[0]) + 1
        if ( isNaN(nv) ) {
            nv = 0
        }
    } catch (err) {
        console.log('zero file?')
        nv = 0
    }
     
    let next_version_location = `${increment_type}/${increment_symbol}/${nv}.json`
    let tvl_location = `snob/tvl`
    console.log('new version:', nv, 'new version location:', next_version_location)
    
    await s3.upload(Object.assign({}, s3object, {  
        Bucket: 'beta.scewpt.com',      
        Key: tvl_location,
        Body: new_tvl.locked.toFixed(2),
        ContentType: 'text/plain',
        ACL: 'public-read',
    })).promise();

    await s3.upload(Object.assign({}, s3object, {        
        Body: increment_out,
        ContentType: 'application/json',
        WebsiteRedirectLocation: '/' + next_version_location,
        ACL: 'public-read',
    })).promise();    

    await s3.upload(Object.assign({}, s3object, {
        Key: next_version_location,
        Body: increment_out,
        ContentType: 'application/json',
        ACL: 'public-read',
    })).promise();
    exit()
})();

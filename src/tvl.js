import fs from 'fs';
import Web3 from 'web3'
import AWS from 'aws-sdk';
import { request, gql } from 'graphql-request';
import { versioning, getcurrent } from './versioning.js';
import { dexes, tokens } from './statemachine.js';
import { exit } from 'process';

const abi = JSON.parse(fs.readFileSync('public/abi.json'));

AWS.config.update({ region: 'us-east-1' });

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

(async () => {

    /*
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
    */

    dexes.snob.tvl.pairs(pair => {
        let wtf = pair.accounts.map(a => { return { account_name: Object.keys(s)[0] }});
        console.log(wtf);
    })

})();

console.log('done')


/*

let load = [
    { symbol: 'wavax' }, { symbol: 'link' }, { symbol: 'eth' }, { symbol: 'png' }, { symbol: 'snob' }, 
    { symbol: 'sushi' }, { symbol: 'usdt' }, { symbol: 'dai' }, { symbol: 'wbtc' }
];



    const players = await Promise.all(load.map(async (p) => {
        console.log('get:', p.symbol)
        let data = await s3.getObject({
            Bucket: 'powder.network',
            Key: 
        }).promise()
        let content = await data.Body.toString();
        let loaded_p = JSON.parse(content);

        return Object.assign({}, p, loaded_p)
    }));
    
    const player = (symbol) => {
        return players.filter(p => { return symbol.toLowerCase() == p.symbol.toLowerCase() })[0]
    }

    console.log('player:', player('snob'))

    let new_tvl = Object.assign({
        pairs: [
            {
                contract: '0xdE1A11C331a0E45B9BA8FeE04D4B51A745f1e4A4',
                token0: player('usdt'), token1: player('dai'),
                accounts: [{ contract: '0xdE1A11C331a0E45B9BA8FeE04D4B51A745f1e4A4'}]                 
            },            
            {
                token0: player('wavax'), token1: player('wbtc'),
                accounts: [{ pool: '0x39be35904f52e83137881c0ac71501edf0180181'}]
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
        player('snob'), { timestamp: nowish }
    );

    new_tvl.pairs[0].token2 = {
        symbol: 'BUSD',
        id: '0xaeb044650278731ef3dc244692ab9f64c78ffaea'
    }

    let stablepair_uint = await s3d.methods.balanceOf('0xB12531a2d758c7a8BF09f44FC88E646E1BF9D375').call()
    let stablepairlocked = stablepair_uint / 1e18    
    new_tvl.pairs[0].accounts[0].locked = stablepairlocked    
    new_tvl.pairs[0].locked = stablepairlocked

    let ap = player('wavax').price
    

    
    tvl_sum += stablepairlocked

    if ( tvl_sum < 12500000 ) {
        throw 'Value To Low!'
    }
    Object.assign(new_tvl, { locked_value: tvl_sum, locked: tvl_sum })

    console.log('tvl sum:', tvl_sum);

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

    
    //exit()
    
})();
*/
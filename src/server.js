import { topics, addresses } from './avalanche.js';
import { exit } from 'process';

const subs = [{
    id: 1, 
    method: 'eth_subscribe', 
    params: ['newHeads'],
}, {
    id: 2, 
    method: 'eth_subscribe', 
    params: ['logs', {}],
}]

const safedata = (data, t) => {
    if ( t === 'sync') return data / 1e12
    try {
        return data / 1e18
    } catch (err) {
        try {
            return data / 1e21
        } catch (err2) {
            return 'bad data'
        }
    }
}

const prefix = '0x000000000000000000000000';

const addresstopic = (a) => {
    if ( a.startsWith(prefix) ) {
        let address = '0x' + a.substring(26)
        if ( addresses[address] ) {
            return addresses[address]
        }
        return address
    } else {
        return a
    }
    
}

const topicmap = (m) => {
    return m.map(t => { 
        let kt = topics[t];
        if ( !kt ) {
            kt = addresstopic(t);
        }
        return kt.padEnd(kt.startsWith('0x') ? 0 : 20, ' ')
    })
}

const txprint = (result) => {
    let address = Object.keys(addresses).includes(result.address) ? addresses[result.address] : result.address
    let t = `    ${ topicmap(result.topics).join(' ') }`
    let p = 120 - t.length;
    console.log('yo:', p);
    return t.padEnd(p, '!') + `${ address } - ${ safedata(result.data, result.topics[0]) }` + '\n'
}

const txlogprint = (results) =>  {
    let s = `  number: ${ results[0].blockNumber / 1 } hash: https://cchain.explorer.avax.network/tx/${ results[0].transactionHash }\n\n`
    results.filter(r => { return topics[r.topics[0]] !== 'approval' }).forEach(r => {
        s +=  txprint(r)
    })
    return s;
}

const ws = new WebSocket('wss://api.avax.network/ext/bc/C/ws');

ws.on('open', () => {
    console.log('open');
    ws.send(JSON.stringify(subs[0]))
});

const current = { bn: 0}


const check = (bn, f) => {
    if ( bn !== current.bn && current.bn > 0 ) {
        Object.keys(current).filter(k => k !== 'bn').forEach(key => {
            if ( current[key][0].blockNumber / 1 !== bn ) {
                console.log(txlogprint(current[key]));
                delete current[key]
            }
        })
    } else {
        current.bn = bn
    }    
}
  
ws.on('message', (data) => {
    try {
        let msg = JSON.parse(data)
        if ( msg.result ) {
            console.log('subscribed:', msg.id, msg.result)
            let sub = subs.filter(s => {  return s.id === msg.id })[0]
            Object.assign(sub, { subscription: msg.result })
            let rs = subs.filter(s => {  return s.subscription === undefined })
            console.log('remaining:', rs, subs.length - rs.length)
            if ( rs.length > 0 ) {
                ws.send(JSON.stringify(rs[0]))
            }            
        } else if ( msg.params ) {
            let sub = subs.filter(s => { return s.subscription === msg.params.subscription })[0]
            if ( sub.id === 1 ) {
                check(msg.params.result.number / 1)
            } else if ( sub.id === 2 ) {
                let bn = msg.params.result.blockNumber / 1;
                check(bn)
                if ( !Object.keys(current).includes(msg.params.result.transactionHash) ) {
                    current[msg.params.result.transactionHash] = [msg.params.result];                    
                } else {
                    current[msg.params.result.transactionHash].push(msg.params.result)
                }                
            } else if ( sub.id === 3 ) {
                console.log('3')
                exit()
            }
        }
    } catch (err) {
        console.log('message error:', err, 'data:', data)
    }
});

const wss = new WebSocket.Server({ port: 5001 });

wss.on('connection', (ws) => {
    
    console.log('connection:', ws)
    
    ws.on('message', (msg) => {
        console.log('message:', msg)
    });

    ws.on('open', (e) => {
        console.log('open:', e)
    });    

    ws.on('close', (e) => {
        console.log('close:', e)
    });

    ws.on('error', (e) => {
        console.log('close:', e)
    });

});
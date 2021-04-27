const subs = [{
    id: 1, 
    method: 'eth_subscribe', 
    params: ['newHeads'],
}, {
    id: 2, 
    method: 'eth_subscribe', 
    params: ['logs', {}],
}]

const eth = 'wss://mainnet.infura.io/ws'
const avax = 'wss://api.avax.network/ext/bc/C/ws';
const ws = new WebSocket(avax);

ws.onopen = (e) => {
    console.log('open:', e);
    ws.send(JSON.stringify(subs[0]))
};

const current = { bn: 0}

const check = (bn, f) => {
    if ( bn !== current.bn && current.bn > 0 ) {
        Object.keys(current).filter(k => k !== 'bn').forEach(key => {
            if ( current[key][0].blockNumber / 1 !== bn ) {                
                document.dispatchEvent(new CustomEvent('tx', { detail: current[key] }))
                console.log('remove tx:', current[key] );
                delete current[key]
            }
        })
    } else {
        current.bn = bn
    }    
}

ws.onmessage = (event) => {
    try {
        let msg = JSON.parse(event.data)
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
            }
        }
    } catch (err) {
        console.log('message error:', err, 'data:', data)
    }
}

export { ws }
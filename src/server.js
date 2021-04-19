import WebSocket from 'ws';

const subs = [{
    id: 2, 
    method: 'eth_subscribe', 
    params: ['newHeads'],
}]

const ws = new WebSocket('wss://api.avax.network/ext/bc/C/ws', {
  perMessageDeflate: false
});

ws.on('open', () => {
    console.log('open');
    ws.send(JSON.stringify(subs[0]))
});
  
ws.on('message', (data) => {
    try {
        let msg = JSON.parse(data)
        if ( msg.result ) {
            console.log('subscribed:', msg.id)
            let sub = subs.filter(s => {  return s.id === msg.id })[0]
            Object.assign(sub, { subscription: msg.result })
            let rs = subs.filter(s => {  return s.subscription_id === undefined })
            if ( rs.length > 0 ) {
                ws.send(JSON.stringify(rs[0]))
            }            
        } else if ( msg.params ) {
            subs.filter(s => { s.subscription === msg.params.subscription }).forEach(sub => {

            })
            console.log(subs)
            console.log('message for you sire:', msg)
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
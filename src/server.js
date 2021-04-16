import WebSocket from 'ws';

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
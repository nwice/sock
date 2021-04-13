import WebSocket from 'ws';

let socket = new WebSocket("ws://localhost:5001");

socket.onopen = function(e) {
    console.log('open:', e)
};
  
socket.onmessage = (e) => {
    console.log('message:', e);
};
  
socket.onclose = (e) => {
    console.log('close:', e);
}
  
socket.onerror = (error) => {
    console.log('error:', error);
};
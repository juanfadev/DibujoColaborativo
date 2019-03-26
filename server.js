const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9001 });

let arrayDrawing = []

wss.on('connection', function connection(ws) {
    console.log(`Clients: ${wss.clients.size}`);
    if (wss.clients.size <= 1){
        cleanDrawing();
    }
    console.log("Connection open");
    if (arrayDrawing.length>0){
        ws.send(JSON.stringify(arrayDrawing));
    }
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        arrayDrawing.push(message);
        wss.clients.forEach(function each(client) {
            client.send(message);

        });
    });
});

function cleanDrawing(){
    arrayDrawing = [];
}
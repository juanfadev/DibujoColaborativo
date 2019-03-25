var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({port: 9001});
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        wss.clients.forEach(function each(client) {
            client.send(message);
        });
    })
    ;
});
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 9001});
const wsu = new WebSocket.Server({port: 9002});

let canvas;
let userList = [];
let clientId = 0;

wss.on('connection', function connection(ws) {
    console.log(`Clients: ${wss.clients.size}`);
    if (wss.clients.size <= 1) {
        cleanDrawing();
    }
    console.log("Connection open");
    if (canvas) {
        ws.send(canvas);
    }
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        canvas = message;
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(canvas);
            }
        });
    });
});

function cleanDrawing() {
    canvas = null;
}

wsu.on('connection', function connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    console.log(`Clients: ${wss.clients.size}`);
    let thisId = clientId++;
    console.log('Client #%d connected', thisId);
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        userList.push(message);
        wsu.clients.forEach(function each(client) {
            client.send(JSON.stringify(userList));

        });
    });
    ws.on('close', function () {
        console.log('Client #%d disconnected', thisId);
        userList.splice(thisId, 1);
        clientId--;
        wsu.clients.forEach(function each(client) {
            client.send(JSON.stringify(userList));
        });
    });

});

//FORCE CLOSE IF NOT PINGS
function noop() {
}

function heartbeat() {
    this.isAlive = true;
}

const interval = setInterval(function ping() {
    wsu.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);

//
if (window.WebSocket) {
    console.log("WebSocketssupported.");
} else {
    console.log("WebSocketsNOT supported.");
    alert("Considerupdatingyourbrowser fora betterexperience.");
}

var output;

window.addEventListener("load", init);
wsUri = "ws://localhost:9001/";

function init() {
    initServer();
    canvas = new fabric.Canvas('canvas');
    canvas.freeDrawingBrush.color = 'green';
    canvas.freeDrawingBrush.lineWidth = 10;
    addCircle.addEventListener('click', addCircleHandler);
    addRectangle.addEventListener('click', addRectangleHandler);
    addTriangle.addEventListener('click', addTriangleHandler);
    pencil.addEventListener('click', pencilHandler);
    selection.addEventListener('click', selectionHandler)
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function addCircleHandler() {
    var obj = {radius: 20, fill: 'green', left: 100, top: 100};
    sendObject('Circle', obj);
}

function addRectangleHandler() {
    var obj = {top: 100, left: 100, width: 60, height: 70, fill: 'red'};
    sendObject('Rectangle', obj);
}

function addTriangleHandler() {
    var obj = {width: 20, height: 30, fill: 'blue', left: 50, top: 50};
    sendObject('Triangle', obj);
}

function pencilHandler() {
    canvas.isDrawingMode = true;
}

function selectionHandler() {
    canvas.isDrawingMode = false;
}

function initServer() {
    websocket = new WebSocket('ws://localhost:9001');
    //websocket.onopen = connectionOpen;
    websocket.onmessage = onMessageFromServer;
}

function onMessageFromServer(message) {
    console.log('received: ' + message);
    if (isJson(message.data)) {
        var obj = JSON.parse(message.data);
        console.log("gotdata fromserver");
        if (Array.isArray(obj)) {
            obj.forEach((a) => {
                let o = JSON.parse(a);
                addObject(o.type, o.data);
            });
        } else {
            addObject(obj.type, obj.data);
        }
    }
}

function addObject(type, obj) {
    var shape;
    if (type == 'Triangle') {
        shape = new fabric.Triangle(obj);
    } else if (type == 'Rectangle') {
        shape = new fabric.Rect(obj);
    } else if (type == 'Circle') {
        shape = new fabric.Circle(obj);
    }
    canvas.add(shape);
}

function sendObject(type, obj) {
    websocket.send(JSON.stringify({'type': type, 'data': obj}));
}


///TEST WEB SOCKET
function testWebSocket() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
}

function onOpen() {
    writeToScreen("CONNECTED");
    doSend("HelloWebsocket!!");
}

function onClose() {
    writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
    writeToScreen('<spanstyle="color: blue;">RESPONSE: ' + evt.data + '</span>');
    websocket.close();
}

function onError(evt) {
    writeToScreen('<spanstyle="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
    writeToScreen("SENT: " + message);
    websocket.send(message);
}

function writeToScreen(message) {
    console.log(message);
    var pre = document.createElement("p");
    pre.innerHTML = message;
    output.appendChild(pre);
}

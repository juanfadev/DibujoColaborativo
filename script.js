if (window.WebSocket) {
    console.log("WebSocketssupported.");
} else {
    console.log("WebSocketsNOT supported.");
    alert("Considerupdatingyourbrowser fora betterexperience.");
}

var output;
var canvas;
var autoSyncMode;
var userList;
var userName;
var lastCanvas;

window.addEventListener("load", init);
wsUri = "ws://localhost:9001/";

function init() {
    userName = prompt("Introduce tu nombre", "Pepe");
    initServer();
    initUserServer();
    canvas = new fabric.Canvas('canvas');
    canvas.freeDrawingBrush.color = 'green';
    canvas.freeDrawingBrush.lineWidth = 10;
    addCircle.addEventListener('click', addCircleHandler);
    addRectangle.addEventListener('click', addRectangleHandler);
    addTriangle.addEventListener('click', addTriangleHandler);
    pencil.addEventListener('click', pencilHandler);
    selection.addEventListener('click', selectionHandler)
    autoSyncMode = setInterval(sync, 1000);
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
    addObject('Circle', obj);
}

function addRectangleHandler() {
    var obj = {top: 100, left: 100, width: 60, height: 70, fill: 'red'};
    addObject('Rectangle', obj);
}

function addTriangleHandler() {
    var obj = {width: 20, height: 30, fill: 'blue', left: 50, top: 50};
    addObject('Triangle', obj);
}

function pencilHandler() {
    canvas.isDrawingMode = true;
}

function selectionHandler() {
    canvas.isDrawingMode = false;
}

function initServer() {
    websocket = new WebSocket('ws://localhost:9001');
    websocket.onmessage = onMessageFromServer;
}

function onMessageFromServer(message) {
    console.log('received: ' + message);
    if (isJson(message.data)) {
        canvas.loadFromJSON(message.data, canvas.renderAll.bind(canvas));
        console.log("Got Canvas from server");
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
    sync();
}

function sendObject(type, obj) {
    websocket.send(JSON.stringify({'type': type, 'data': obj}));
}

function sync() {
    let actualCanvas = JSON.stringify(canvas.toJSON());
    if (lastCanvas === actualCanvas){

    }else{
        websocket.send(actualCanvas);
    }
    lastCanvas = actualCanvas;
}

//USER SERVER

function initUserServer() {
    websocketUser = new WebSocket('ws://localhost:9002');
    websocketUser.onopen = connectionOpen;
    websocketUser.onmessage = onMessageFromUserServer;
}

function onMessageFromUserServer(message) {
    console.log('UserList Message: ' + message);
    userList = JSON.parse(message.data);
    console.log(userList);
    createList();
}

function connectionOpen() {
    websocketUser.send(userName);
}

function createList() {
    const ul = document.createElement('ul');

    document.getElementById('userList').appendChild(ul);

    userList.forEach(function (item) {
        let li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML += item;
    });
}

//CLOSE WEB SOCKETS
window.onbeforeunload = function() {
    websocket.onclose = function () {}; // disable onclose handler first
    websocketUser.onclose = function () {};
    websocket.close();
    websocketUser.close();
};


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

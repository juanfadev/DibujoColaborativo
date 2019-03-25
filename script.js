if (window.WebSocket) {
    console.log("WebSocketssupported.");
} else {
    console.log("WebSocketsNOT supported.");
    alert("Considerupdatingyourbrowser fora betterexperience.");
}

window.addEventListener("load", init);
wsUri = "ws://localhost:9001/";

function init() {
    output = document.getElementById("output");
    testWebSocket();
}

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
    var pre = document.createElement("p");
    pre.innerHTML = message;
    output.appendChild(pre);
}

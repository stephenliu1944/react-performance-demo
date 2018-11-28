const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');

const env = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')));
const PORT = env.webSocket.port;

var http = require('http').createServer();
var io = require('socket.io')(http, {
    pingInterval: 10000,
    pingTimeout: 5000
});

var intervalId;                         // 保存轮询id, 便于clear
var MESSAGE_INTERVAL = 1000;            // 消息间隔时间

io.on('connection', function(socket) {
    // 向客户端轮询发起消息
    intervalId = setInterval(function() {
        socket.emit('message', { 
            id: uuidv4()
        });
    }, MESSAGE_INTERVAL);
});

http.listen(PORT, function() {
    console.log('listening on: ' + PORT);
});
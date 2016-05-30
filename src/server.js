var express = require('express');
var path = require('path');
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.port || 3000;

server.listen(port);

app.use('/', express.static(path.join(__dirname, 'client')));

// Set socket.io listeners.
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

module.exports = {
    app,
    io
}

require('./ble.js')

var io = require('socket.io').listen(8000);
var roomList = {};

io.sockets.on('connection', function (socket) {

    // client call socket.emit('NICK', ..player name here);
    socket.on('NICK', function (name) {
        socket.playerName = name;
        console.log(name + ' connected');
    });

    socket.on('JOIN', function (roomID) {
        socket.roomId = roomID;
        if (roomList[roomID] == undefined) {
            socket.emit('JOIN', roomID, 'WAIT');
            roomList[roomID] = [socket];
        } else {
            roomList[roomID].push(socket);
            if (roomList[roomID].length > 2)
                socket.emit('JOIN', roomID, 'WATCH');
            else
                roomList[roomID].forEach(function (sk) {
                    sk.emit('JOIN', roomID, 'PLAY');
                });
        }
    });

    // client call socket.emit('MOVE', x, y);
    socket.on('MOVE', function (x, y){
        roomList[socket.roomId].forEach(function (sk){
            sk.emit('MOVE', socket.playerName, x, y);
        });

        console.log(socket.playerName + ' tick ' + x + ', ' + y);
    });

    // socket.emit(CHAT, msg);
    socket.on('CHAT', function (data) {
        socket.broadcast.emit('CHAT', socket.playerName, data);
        console.log(data);
    });
});

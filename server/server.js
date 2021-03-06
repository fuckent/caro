var io = require('socket.io').listen(8000);
io.set('log level', 1);                    // reduce logging
io.set('close timeout', 3);
io.set('heartbeat timeout', 3);
io.set('heartbeat interval', 5);
io.set('polling duration', 10);

function UserData(id, name, password, email) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.email = email;
}


function dataBase() {
    this.nUser = 0;
    this.listUser = [];

    this.addUser = function(name, pass, email) {
        this.listUser.push(new UserData(this.nUser++, name, pass, email));
    };

    this.deleteUser = function(id) {
        delete this.listUser[id];
    };

    this.getUserID = function(name) {
        var lu = this.listUser.filter( function(u) {
            return u.name == name;
        }
        );

        if (lu.length == 0) return null;
        return lu[0].id;
    };
}

function User() {
    this.OLUser =[];
    this.db = new dataBase();

    this.register = function(name, pass, email) {
        this.db.addUser(name, pass, email);
    };

    this.getUserID = function(name) {
        return this.db.getUserID(name);
    }

    this.login = function(name, pass) {
        var id = this.getUserID(name);
        this.OLUser[id] = true;
    };

    this.logout = function(id, token) {
        delete this.OLUser[id];
    };

    this.isOnline = function(id) {
    };

    this.getRoom = function(id) {

    };

    this.getRole = function(id) {
    };

    this.getName =function(id) {
    };
}





var winstate = require('./winstate');

var roomList = {};

io.sockets.on('connection', function (socket) {

    // client call socket.emit('NICK', ..player name here);
    socket.on('NICK', function (name) {
        socket.playerName = name;
        logs('User: ' + name + ' connected');
    });

    socket.on('JOIN', function (roomID) {
        socket.roomId = roomID;
        if (roomList[roomID] == undefined) {
            socket.emit('JOIN', roomID, 'WAIT');
            var rm = new room(roomID);
            roomList[roomID] = rm;
            rm.listUser.push(socket);
            rm.A = socket;
            rm.turn = 1;
            logs(socket.playerName + ' created room ' + roomID);
        } else {
            var rm = roomList[roomID];
            socket.roomId = roomID;
            rm.listUser.push(socket);
            if (rm.listUser.length > 2) {
                socket.emit('JOIN', roomID, 'WATCH');
                logs('User ' + socket.playerName + ' is watching room ' + roomID);
            }
            else {
                rm.listUser.forEach(function (sk) {
                    sk.emit('JOIN', roomID, 'PLAY');
                });
                rm.B = socket;
                logs('The second player ' + socket.playerName +' had joined room ' + socket.roomId);
            }
        }
    });

    // client call socket.emit('MOVE', x, y);
    socket.on('MOVE', function (x, y) {
        var rm = roomList[socket.roomId];
        try {
            if (rm.listUser.length <2) throw 'DENIED';

            var plr = rm.turn == 1 ? rm.A : rm.B;
            if (plr != socket) throw 'DENIED';

            if (rm.board.CellisChecked(x, y)) throw 'DENIED'

            rm.board.move(x, y, rm.turn);
            roomList[socket.roomId].listUser.forEach(function (sk) {
                sk.emit('MOVE', socket.playerName, x, y);
            });


            logs(socket.playerName + ' tick ' + x + ', ' + y);

            if (rm.board.checkWin(x, y)) {

                roomList[socket.roomId].listUser.forEach(function (sk) {
                    sk.emit('WIN', plr.playerName);
                });

                logs(plr.playerName + ' won game in room ' + socket.roomId);
            }

            rm.turn = 3 - rm.turn;
        } catch (e) {
            logs(e);
            socket.emit('MOVE', 'DENIED', -1, -1);
            logs(socket.playerName + ' was denied to play');
        }
    });

    // socket.emit(CHAT, msg);
    socket.on('CHAT', function (data) {
        socket.broadcast.emit('CHAT', socket.playerName, data);
        logs(socket.playerName +' say: ' +data);
    });

    socket.on('STT', function(roomID) {
        var rm = roomList[roomID];
        socket.emit('STT', rm.board.stateArray, rm.turn);
        logs('Sent room ' + roomID + ' info to player ' + socket.playerName);

    });
});


function logs(msg) {
    console.log('[CARO] ' +msg);
}

function room(roomID) {
    this.id = roomID;
    this.board = new winstate.Board();
    this.A = null;
    this.B = null;
    this.turn = 0;
    this.listUser = [];
}

function Cell(x, y) {
    this.x = x;
    this.y = y;
}


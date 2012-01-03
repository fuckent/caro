// this file connect to server and deal with many communicate problems

var myturn = 0;
var COLOR = ['', '#f00', '#00f'];
var draw = [];
draw[1] = drawX;
draw[2] = drawO;


function setNickName() {
    var txt = $('#inputNick').val();
    playerName[0] = txt;
    server.setNickName();

    $('#inputNick').fadeOut(function() {
        $('#login').append(txt);
        });

    return false;
}


function Server(site) {
    //first, connect to server
    this.chat = function (msg) {
        this.socket.emit('CHAT', msg);
    }

    this.setNickName = function() {
        var txt = $('#inputNick').val();
        this.nick = txt;
        this.socket.emit('NICK', txt);
        return false;
    }

    // JOIN [ROOM ID]
    this.joinRoom = function (roomid){
        log('sending JOIN message to server');
        this.socket.emit('JOIN',roomid);
    }

    this.sendMoveCaro = function (x,y){
        this.socket.emit('MOVE',x,y);
    }



    try {
        this.socket = new io.connect(site);

        this.socket.onopen = function() {
            log('Socket Status: '+socket.readyState+' (open)', 'event');
        }

        this.socket.on('CHAT', function(nick, msg) {
            showReceiveMess(nick +': ' + msg, 'event');
        $('#ChatBoxText').get(0).scrollTop = 10000000;

            log(nick +': ' + msg, 'event');
            $('#ChatBoxText').get(0).scrollTop = 10000000;
    });

    this.socket.on('JOIN', function(roomid,status) {
        if(status == 'WAIT'){
            myturn = 1;
            turn = 1;
            log('JOIN '+ roomid +' '+ status);
        }
        else if(status == 'PLAY'){
            if (myturn != 1) myturn = 2;
            turn = 1;
            stt.textContent = "[RIVAL TURN]";
            stt.textContent = "[YOUR TURN]";
            log('JOIN '+ roomid +' '+ status);
        }
        else if(status == 'WATCH'){
            turn = 1;
            myturn = 0;
            stt.textContent = "[WATCHING]";
            server.socket.emit('STT', roomid);
            log('JOIN '+ roomid +' '+ status);
        }
    });

    this.socket.on('MOVE', function(name, x, y) {
        if (x == -1) log('Move denied', 'error');
        else {
            if(stt.textContent == "[YOUR TURN]"){
                stt.textContent = "[RIVAL TURN]";
            }
            else if(stt.textContent == "[RIVAL TURN]"){
                stt.textContent = "[YOUR TURN]";
            }
            // update board if anyone else check
				clearlight();
				lastx = x * CELL_SIZE + CELL_SIZE / 2;
				lasty = y * CELL_SIZE + CELL_SIZE / 2;
				lastturn = turn;
				highlight(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, COLOR[turn]);
                draw[turn](x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, COLOR[turn]);
            turn = 3 - turn;
            log('Move: ' + name +' tick at (' + x + ',' + y +')', 'event');
        }

    } );

    this.socket.on('WIN', function(name) {
        turn = -1;
        log('<b>Congratulation !!!  ' + name + ' won the game</b>',  'annound');
    });

    this.socket.on('STT', function(state, turn1) {
        turn = turn1;
        reDrawBoard(state);
    });

    this.socket.onclose = function () {
        log('Socket Status: ' + socket.readyState + ' (close)', 'event');
    }
    } catch (ex) {
        log('Error: ' + ex, 'error');
    }
}

function log(msg, type) {
    $("#logs").append('<p class = "' + type + '">' + msg + '</p>');
}

function showReceiveMess(msg, type) {
    $("#ChatBoxText").append('<p>' + msg + '</p>');
}

// this file connect to server and deal with many communicate problems

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
			if(player == null){
				player = 1;
				turn = 1;
			}			
			log('JOIN '+ roomid +' '+ status);
		}
        else if(status == 'PLAY'){
			if(player == null){
				player = 2;
				turn = 2;
				stt.textContent = "[RIVAL TURN]";
			}	
			else if(player == 1){
				stt.textContent = "[YOUR TURN]";
			}	
			log('JOIN '+ roomid +' '+ status);
		}
        else if(status == 'WATCH'){
			if(player == null){
				player = 3;
				stt.textContent = "[WATCHING]";
			}		
			log('JOIN '+ roomid +' '+ status);
		}
    });

    this.socket.on('MOVE', function(name, x, y) {
		turn = 3 - turn;
		if(stt.textContent == "[YOUR TURN]"){
			stt.textContent = "[RIVAL TURN]";
		}
		else if(stt.textContent == "[RIVAL TURN]"){
			stt.textContent = "[YOUR TURN]";
		}
        // update board if anyone else check
        if(playerName[0] != name){
			if(player == 1){ // rival player = 2, check X
				drawX(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
			}
			else if(player == 2){
				drawO(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
			}
		}
        log('Move: ' + name +' tick at (' + x + ',' + y +')');
        
    } );

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

// CARO project
// Authors: Thong + Thanh
// Date: 12/31/2010
// js source code for client-side caro game
//var BOARD_SIZE = 300;
// some game config
var NCELL = 15; // number of cell on each dimensal
var CELL_SIZE = 25; // size of a cell of game board
var XO_RATE = 2 / 3; // relative size of X/O with cell
var board = null; // global variable board of game
var player = null; // it determines what player-turn
var stt = null;
var count = 10;
var server = null;
var snd = null;
var turn = 1;
var roomID = 2;

var lastx = null;
var lasty = null;
var lastturn = null;

// Cell class, we need to save the location of a cell on board


function Cell(row, column) {
    this.row = row;
    this.column = column;
}

function updateStateArray(x, y) {
}





// This function converts coordinates of click from page coordinates to canvas coordinates
// only need to know that
// i copied from this function from a book :-)


function getCursorPosition(e) {
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= board.offsetLeft;
    y -= board.offsetTop;
    var cell = new Cell(Math.floor(y / CELL_SIZE), Math.floor(x / CELL_SIZE));
    return cell;
}

var playerName = ['', 'RED', 'BLUE'];
//This function will be called when player clicked on board
// so, all we need to solve begin that event


function gameBoardOnClick(e) {
    //var draw = [drawX, drawO];
    count--;

    var pos = getCursorPosition(e); // pos is locations (row, column) player clicked
    if (turn == myturn ) {
        server.sendMoveCaro(pos.column, pos.row);
        log(playerName[0] + " sending MOVE ["+ pos.column+"] ["+ pos.row+"]");
    } else log('Move denied', 'error');

    // player 1 , check O
    /*
        if(player == 1){
            if(turn  == 1){
                snd.play('tick');
                drawO(pos.column * CELL_SIZE + CELL_SIZE / 2, pos.row * CELL_SIZE + CELL_SIZE / 2);
                log(playerName[0] + " sending MOVE ["+ pos.column+"] ["+ pos.row+"]");
                stt.textContent = "[RIVAL TURN]";
            }
        }
        // player 2, check X
        else if (player == 2){
            if(turn == 1){
                stt.textContent = "[YOUR TURN]";
                snd.play('tick');
                drawX(pos.column * CELL_SIZE + CELL_SIZE / 2, pos.row * CELL_SIZE + CELL_SIZE / 2);
                server.sendMoveCaro(pos.column, pos.row);
                log(playerName[0] + " sending MOVE ["+ pos.column+"] ["+ pos.row+"]");
                stt.textContent = "[RIVAL TURN]";
            }
        }
        */
}

// this function called in the first time!


function runGame(){
    snd = new sound();
    stt = document.getElementById("status");
    stt.textContent = "[READY]"; // set game status to READY

    $('#F5Button').click(function () {
        $('#GameBoard').fadeOut();
        $('#GameBoard').fadeIn();
        server.socket.emit('STT', roomID);
    });

    $('#delete_button').click(function () {
        $('#logs')[0].textContent = null;
    });

    $('#chatform').submit(soundbites);

    board = document.getElementById("GameBoard"); // get canvas element from page
    board.addEventListener("click", gameBoardOnClick, false); // blind click event to game... function
    drawBoard(); // draw board of game for this first time
    server = new Server('http://caro.nodester.com');
    $('#login').submit(setNickName);

    // JOIN ROOM
    server.joinRoom(roomID);
}


function reDrawBoard(state) {

    drawBoard();
    for (var i = 0; i < NCELL; i++) {
        for (var j = 0; j < NCELL; j++) {
            try {
                if (state[i] [j] != undefined) {
                    var t = state[i] [j];
                    draw[t](i * CELL_SIZE + CELL_SIZE / 2, j * CELL_SIZE + CELL_SIZE / 2, COLOR[t]);
                }
            } catch (e) {}

        }
    }

}

function drawBoard() {

    board.height = NCELL * CELL_SIZE + 2;
    board.width = NCELL * CELL_SIZE + 2;
    var b_context = board.getContext("2d");
    b_context.clearRect(0,0, board.height, board.height);
    b_context.lineWidth = 1;
    b_context.lineCap = 'round';

    // b_context.fillRect(100, 100, 100, 100);
    // Now, draw grid for board
    for (var i = 1; i < NCELL; i++) {
        b_context.moveTo(0.5, 0.5 + i * CELL_SIZE);
        b_context.lineTo(0.5 + NCELL * CELL_SIZE, 0.5 + i * CELL_SIZE);

        b_context.moveTo(0.5 + i * CELL_SIZE, 0.5);
        b_context.lineTo(0.5 + i * CELL_SIZE, 0.5 + NCELL * CELL_SIZE);

        // Show it in screen
        b_context.strokeStyle = "#eee";
        b_context.stroke();
    }
}

function highlight(x, y){
    var context = board.getContext("2d");
    context.fillStyle = 'FFE1FF';
	context.fillRect (x-CELL_SIZE/2,y - CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
}
function clearlight( ){
	if(lastx != null && lasty != null){
		log("erase highlight cell ["+lastx+"]["+lasty+"]", 'annound');
		var context = board.getContext("2d");
		context.fillStyle = 'FFFFFF';
		context.fillRect (lastx-CELL_SIZE/2,lasty - CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
		draw[lastturn](lastx, lasty,COLOR[t]);
	}
}


function drawX(x, y, color) {
    var context = board.getContext("2d");
    var delta = CELL_SIZE / 2.5 * XO_RATE;
    context.strokeStyle = color;

    context.lineWidth = CELL_SIZE / 10;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(x - delta, y - delta);
    context.lineTo(x + delta, y + delta);

    context.stroke(); // Rect(x-delta, y - delta, 2*delta, 2*delta);
    context.closePath();
    context.beginPath();

    context.moveTo(x - delta, y + delta);

    context.lineTo(x + delta, y - delta);
    context.stroke(); // Rect(x-delta, y - delta, 2*delta, 2*delta);
    context.closePath();
    context.strokeStyle = "#eee";
}

function drawO(x, y, color) {
    var context = board.getContext("2d");
    var radius = CELL_SIZE * XO_RATE / 2;
    context.lineWidth = CELL_SIZE / 10;
    context.strokeStyle = color;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, true); // Outer circle
    context.closePath();
    context.stroke(); // Rect(x-delta, y - delta, 2*delta, 2*delta);
}

function winner(pos1, pos2) {
    if (player == 2) {
        log("<b>Red player win!!!</b>", 'annound');
    } else {
        log("<b>Blue player win</b>", 'annound');
    }
    var x1 = (pos1.row - 0.5) * CELL_SIZE;
    var y1 = (pos1.column - 0.5) * CELL_SIZE;

    var x2 = (pos2.row - 0.5) * CELL_SIZE;
    var y2 = (pos2.column - 0.5) * CELL_SIZE;

    var context = board.getContext("2d");
    context.strokeStyle = '#f0f';
    context.lineWidth = CELL_SIZE / 5;
    context.beginPath();
    context.moveTo(x1, y1); //,radius,0,Math.PI*2,true); // Outer circle
    context.lineTo(x2, y2);
    context.stroke(); // Rect(x-delta, y - delta, 2*delta, 2*delta);
    //board.addEventListener("click", , false);
}

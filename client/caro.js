// CARO project
// Authors: Thong + Thanh
// Date: 12/31/2010

// js source code for client-side caro game
//var BOARD_SIZE = 300;
// some game config
var NCELL = 10;             // number of cell on each dimensal
var CELL_SIZE = 30;         // size of a cell of game board
var XO_RATE = 2/3;          // relative size of X/O with cell
var board = null;           // global variable board of game
var player = 1;             // it determines what player-turn
var stt = null;
var count = 10;

// Cell class, we need to save the location of a cell on board
function Cell(row, column) {
    this.row = row;
    this.column = column;
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
    }
    else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= board.offsetLeft;
    y -= board.offsetTop;
    var cell = new Cell(Math.floor(y/CELL_SIZE),
                        Math.floor(x/CELL_SIZE));
    return cell;
}

var playerName = ['', 'RED', 'BLUE'];
//This function will be called when player clicked on board
// so, all we need to solve begin that event
function gameBoardOnClick(e) {
    //var draw = [drawX, drawO];
    count --;
    player = 3 - player;
    var pos = getCursorPosition(e); // pos is locations (row, column) player clicked

    log(playerName[3-player] + ' tick at (' + pos.row + ', ' + pos.column + ')', 'event');


    // the below line only draw X/O on screen, we need to do more
    // now, focus what i type below
    // fist, we need check that `pos' (cell) is clicked before (a player was chooses it)
    // so, if that cell is free,
    //      + save it location on your state of board variable !!! (so important)
    //      + draw it on screen (the line below)
    //      + check whether it have a player win a game,
    //          if have, call winner(cell1, cell2) function to do more!
    //              (cell1, cell2) are the terminal cells of line which winner got to win the game
    //      (anyway, i'll code wined() function and some stuff to help you

    // HAVE FUN  :-)

    if (player == 1) {
        drawX(pos.column*CELL_SIZE + CELL_SIZE/2, pos.row*CELL_SIZE + CELL_SIZE/2);
        stt.textContent = "[RED TURN]";
    }
    else  {
        drawO(pos.column*CELL_SIZE + CELL_SIZE/2, pos.row*CELL_SIZE + CELL_SIZE/2);
        stt.textContent = "[BLUE TURN]";
    }

    if (count == 0) {
        winner(new Cell(4,5), new Cell(7, 8));
        count = 10;
    }

}

// this function called in the first time!
function runGame() {
    stt = document.getElementById("status");
    stt.textContent = "[READY]"; // set game status to READY

    $('#delete_button').click(function() {
        $('#GameLog')[0].textContent = null;
        }
    );

    board = document.getElementById("GameBoard"); // get canvas element from page
    board.addEventListener("click", gameBoardOnClick, false); // blind click event to game... function
    drawBoard(); // draw board of game for this first time
}

function drawBoard() {

    board.height = NCELL * CELL_SIZE + 2;
    board.width = NCELL * CELL_SIZE  + 2;
    var b_context = board.getContext("2d");
    b_context.lineWidth = 1;
    b_context.lineCap= 'round';


    // b_context.fillRect(100, 100, 100, 100);
    // Now, draw grid for board
    for (var i = 1; i < NCELL; i ++) {
        b_context.moveTo(0.5, 0.5 +i * CELL_SIZE);
        b_context.lineTo(0.5 + NCELL * CELL_SIZE, 0.5 + i * CELL_SIZE);

        b_context.moveTo(0.5 + i * CELL_SIZE, 0.5);
        b_context.lineTo(0.5 + i * CELL_SIZE, 0.5 + NCELL * CELL_SIZE);

        // Show it in screen
        b_context.strokeStyle = "#eee";
        b_context.stroke();
    }
}

function drawX(x, y) {
    var context = board.getContext("2d");
    var delta = CELL_SIZE/2.5 * XO_RATE;
    context.strokeStyle = '#00f';

    context.lineWidth = CELL_SIZE/10;
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
    var radius = CELL_SIZE * XO_RATE/2;
    context.lineWidth = CELL_SIZE/10;
    context.strokeStyle = '#f00';

    context.beginPath();
    context.arc(x,y,radius,0,Math.PI*2,true); // Outer circle
    context.closePath();
    context.stroke(); // Rect(x-delta, y - delta, 2*delta, 2*delta);
}

function winner(pos1, pos2) {
    var x1 = (pos1.row-0.5) * CELL_SIZE  ;
    var y1 = (pos1.column-0.5) * CELL_SIZE;

    var x2 = (pos2.row-0.5) * CELL_SIZE;
    var y2 = (pos2.column-0.5) * CELL_SIZE;


    var context = board.getContext("2d");
    context.strokeStyle = '#f0f';
    context.lineWidth = CELL_SIZE/5;
    context.beginPath();
    context.moveTo(x1,y1); //,radius,0,Math.PI*2,true); // Outer circle
    context.lineTo(x2, y2);
    context.stroke(); // Rect(x-delta, y - delta, 2*delta, 2*delta);

    //board.addEventListener("click", , false);
}

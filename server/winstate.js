var winstate = exports;
NCELL = 10; // number of cell on each dimensal

var Board = winstate.Board = function() {

    this.stateArray = new Array(NCELL);
    this.player = 0;

    this.initstateArray();
}

 Board.prototype.move = function(x, y, plr) {
        this.stateArray[x] [y] = plr;
        this.player = plr;
    }

 Board.prototype.initstateArray = function() {
        var i = 0;
        for (i = 0; i < NCELL; i = i + 1) {
            this.stateArray[i] = new Array(NCELL);
            var j;
            for (j = 0; j < NCELL; j++) {
                this.stateArray[i][j] = 0;
            }
        }
    }

 Board.prototype.printState = function () {
        var a = "";
        var i;
        for (i = 0; i < NCELL; i = i + 1) {
            var j;
            for (j = 0; j < NCELL; j = j + 1) {
                a += this.stateArray[i][j];
            }
            a += "\n";
        }
        alert(a);
    }

    //  Check the cell is checked


 Board.prototype.CellisChecked = function (x, y) {
        if (this.stateArray[x][y] == 1 || this.stateArray[x][y] == 2) return true;
        return false;
    }

 Board.prototype.CellisCheckedBy = function(x, y, num) {
        if (this.stateArray[x] == undefined) return false;
        if (this.stateArray[x][y] == undefined) return false;
        if (this.stateArray[x][y] == num) return true;
        return false;
    }

 Board.prototype.checkHor = function (x) {
        var count = 0;
        var i;
        for (i = 0; i < NCELL; i++) {
            if (this.CellisCheckedBy(x, i, this.player)) {
                count++;
                if (count >= 5) return true;
            } else {
                count = 0;
            }
        }
        return false;
    }

 Board.prototype.checkVert = function(y) {
        var count = 0;
        var i;
        for (i = 0; i < NCELL; i++) {
            if (this.CellisCheckedBy(i, y, this.player)) {
                count++;
                if (count >= 5) return true;
            } else {
                count = 0;
            }
        }
        return false;
    }

 Board.prototype.checkSlash = function(x, y) {
        //alert("Dang trong checkSlash");
        var count = 0;
        var deltax = x;
        var deltay = NCELL - y;

        if (deltax > deltay) {
            //alert("deltax > deltay");
            // lui ve y
            y = NCELL;
            x = x - deltay;
            while (x < NCELL) {
                //alert("checking1 "+x+" " +y);
                if (this.CellisCheckedBy(x, y, this.player)) {
                    count++;
                    //alert(count);
                    if (count >= 5) return true;
                } else {
                    count = 0;
                }
                x = x + 1;
                y = y - 1;
            }
        } else {
            //alert("deltax <= deltay");
            x = 0;
            y = y + deltax;
            while (y >= 0) {
                //alert("checking2 "+x+" " +y);
                if (this.CellisCheckedBy(x, y, this.player)) {
                    count++;
                    //alert(count);
                    if (count >= 5) return true;
                } else {
                    count = 0;
                }
                x = x + 1;
                y = y - 1;
            }
        }
        return false;
    }

 Board.prototype.checkBackSlash = function(x, y) {
        var count = 0;

        if (x > y) {
            // lui ve y
            x = x - y;
            y = 0;
            while (x < NCELL) {
                //alert("checking1 "+x+" " +y);
                if (this.CellisCheckedBy(x, y, this.player)) {
                    count++;
                    //alert(count);
                    if (count >= 5) return true;
                } else {
                    count = 0;
                }
                x = x + 1;
                y = y + 1;
            }
        } else {
            y = y - x;
            x = 0;
            while (y >= 0) {
                //alert("checking2 "+x+" " +y);
                if (this.CellisCheckedBy(x, y, this.player)) {
                    count++;
                    //alert(count);
                    if (count >= 5) return true;
                } else {
                    count = 0;
                }
                x = x - 1;
                y = y - 1;
            }
        }
        return false;
    }

 Board.prototype.checkWin = function(x, y) {
        //check ngang
        if (this.checkHor(x)) return true;
        if (this.checkVert(y)) return true;
        if (this.checkSlash(x, y)) return true;
        if (this.checkBackSlash(x, y)) return true;
        return false;
    }

    // update state array after check

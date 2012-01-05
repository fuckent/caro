var terminal = new Terminal();

$(document).ready(function() {

    terminal.init();

    $('#input_chat')[0].onfocus = function() { terminal.isFocusInput = true};
    $('#input_chat')[0].onblur = function() { terminal.isFocusInput = false};

    window.onkeydown = function (key) {

        if (!terminal.isFocusInput) {
            if (key.keyCode == 8) {terminal.backspaceKey(); return true;}
            if (key.keyCode == 13) terminal.enterKey();
            if (key.keyCode == 46) terminal.deleteKey();
            if (key.keyCode == 37) terminal.toLeftKey();
            if (key.keyCode == 35) terminal.toEndKey();
            if (key.keyCode == 36) terminal.toBeginKey();
            if (key.keyCode == 39) terminal.toRightKey();
        }

        return key;

    }


    window.onkeypress = function (key) {

        if (!terminal.isFocusInput) {
            if (key.charCode >= 32 && key.charCode < 127) {
            var char = String.fromCharCode(key.charCode);

            terminal.getKey(char);}
        }

        return key;
    }

});




var styles = ["background-color: #FF9875;", ""];
var blink = 0;



function Terminal() {
    this.doCommand = function (cmd) {
        /// TODO: MORE HERE!!!
    }


    this.init = function () {
        this.buffer = '';
        this.cursorPos = 0;
        this.isFocusInput = false;
        setInterval(function(){
            $('#csB')[0].style.cssText = styles[blink];
            blink = 1 - blink;

            }, 600);

    }

    this.show = function () {
        if (this.cursorPos< 0)  this.cursorPos = 0;
        $('#csA')[0].textContent = this.cursorPos > 0 ? this.buffer.slice(0, this.cursorPos) : '';
        $('#csC')[0].textContent = this.cursorPos < this.buffer.length - 1 ? this.buffer.slice(this.cursorPos+1) : '';
        $('#csB')[0].textContent = this.cursorPos < this.buffer.length ? this.buffer[this.cursorPos] : ' ';
    }

    this.backspaceKey = function() {
        if (this.cursorPos > 0) {
            this.buffer = this.buffer.slice(0, this.cursorPos-1) +
            this.buffer.slice(this.cursorPos);
            this.cursorPos --;
            this.show();

            }
    }

    this.deleteKey = function() {
        if (this.cursorPos < this.buffer.length) {
            this.buffer = this.buffer.slice(0, this.cursorPos) +
            this.buffer.slice(this.cursorPos + 1);
        this.show();
            }
    }

    this.toLeftKey = function() {
        if (this.cursorPos > 0) this.cursorPos--;

        this.show();

    }

    this.toEndKey = function() {
        this.cursorPos = this.buffer.length;
        this.show();
    }

    this.toBeginKey = function() {
        this.cursorPos = 0;
        this.show();
    }

    this.toRightKey = function() {
        if (this.cursorPos <= this.buffer.length){
            this.cursorPos++;
            this.show();
        }
    }

    this.enterKey = function() {
        this.doCommand(this.buffer);
        this.buffer = '';
        this.cursorPos = 0;

        this.show();
    }

    this.getKey = function(ch) {
            this.buffer = this.buffer.slice(0, this.cursorPos) + ch +
            this.buffer.slice(this.cursorPos);
            this.cursorPos++;
            this.show();
    }
}

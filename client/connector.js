// this file connect to server and deal with many communicate problems

function setNickName() {
    var txt = $('#inputNick').val();
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

    try {
    this.socket = new io.connect(site);

    this.socket.onopen = function() {
        log('Socket Status: '+socket.readyState+' (open)', 'event');
    }

    this.socket.on('CHAT', function(nick, msg) {
        showReceiveMess(nick +': ' + msg, 'event');
        log(nick +': ' + msg, 'event');
    });

    this.socket.on('JOIN', function(nick, msg) {
        showReceiveMess(nick +': ' + msg, 'event');
    });

    this.socket.on('JOIN', function(nick, msg) {

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






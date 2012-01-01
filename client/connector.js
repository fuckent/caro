// this file connect to server and deal with many communicate problems

function server(site) {
    //first, connect to server
    try {
    this.socket = new WebSocket(site);

    socket.onopen = function() {
        log('Socket Status: '+socket.readyState+' (open)', 'event');
    }

    socket.onmessage = function(msg) {
        log('Recieved: ' + msg.data, 'message');
    }

    socket.onclose = function () {
        log('Socket Status: ' + socket.readyState + ' (close)', 'event');
    }
    } catch (ex) {
        log('Error: ' + ex, '');
    }
}

function log(msg, type) {
    $("#GameLog").append('<p class = "' + type + '">' + msg + '</p>');
}

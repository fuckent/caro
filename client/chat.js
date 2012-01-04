function getChatMessage() {
    var input_chat = document.getElementById("input_chat");
    var chatms = input_chat.value;
    return chatms;
}


function soundbites() {
    if (server.nick == undefined) {
        log("[E] Enter nick name!", 'error');
    } else {
        var chatms = getChatMessage();
        showReceiveMess('me', chatms);
        //sendChatMessage( );
        server.chat($('#input_chat').val());
        log('Sent: ' + $('#input_chat').val(), 'event');
        $('#input_chat').val('').focus();
    }
    return false;

}

function getChatMessage(){
     var input_chat = document.getElementById("input_chat");
     var chatms = input_chat.value;
     return chatms;
}

function showChatMessage(chatms){
     var input_chat = document.getElementById("ChatBoxText");
     var newpara = document.createElement('p');
     var newmsm = document.createTextNode(chatms);
     newpara.appendChild(newmsm);
     //alert(newmess.value);
     input_chat.appendChild(newpara);
}

function soundbites( ){
    var chatms = getChatMessage( );
    showChatMessage(chatms);
    //sendChatMessage( );
    $('#ChatBoxText').get(0).scrollTop = 10000000;
    server.chat($('#input_chat').val());
    log('Sent: ' + $('#input_chat').val(), 'event');
    $('#input_chat').val('').focus();
    return false;

}
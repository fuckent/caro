var filesToLoad = 1;
var filesLoaded = 0;

function sound() {
    this.ready = false;

    this.list = {
        'tick':loadAudio('./tick.mp3'),
    };

    this.play = function (name) {
       if (!this.ready) return;
        var snd  = this.list[name];
        if (snd != undefined)
            snd.play();
    };


}

function loadImage(uri)
{
    var img = new Image();
    img.onload = isAppLoaded;
    img.src = uri;
    return img;
}

function loadAudio(uri)
{
    var audio = new Audio();
    //audio.onload = isAppLoaded; // It doesn't works!
    audio.addEventListener('canplaythrough', isAppLoaded, false); // It works!!
    audio.src = uri;
    return audio;
}

function isAppLoaded()
{
    filesLoaded++;
    if (filesLoaded >= filesToLoad) snd.ready = true;
}

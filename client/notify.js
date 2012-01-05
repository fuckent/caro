function Notify (){
    this.checkBrowserSupport = function() {
        if (window.webkitNotifications)
            return true;
        else
            return false;
    }

    this.isWorking = this.checkBrowserSupport();

    if (this.isWorking) {

        this.notify = function (from, msg) {
          if (window.webkitNotifications.checkPermission() == 0) { // 0 is PERMISSION_ALLOWED
            // function defined in step 2
            var note = window.webkitNotifications.createNotification('caro.nodester.com', from, msg);
            setTimeout(function(){
                note.cancel();
                }, '5000');

            note.show();
          } else window.webkitNotifications.requestPermission();
        };
    }






}

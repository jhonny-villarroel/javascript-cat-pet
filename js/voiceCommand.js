/*** Objects and Prototyping Consepts */


var suscribers = {};
// Create the event.
var event = document.createEvent('Event');

/* Constructor Method*/
var VoiceCMD = function(){
    // Define that the event name is 'build'.
    var self = this;
    self.evt = null;
    //event.initEvent('build', true, true);
    self.evt = document.createEvent("Event");
    self.evt.initEvent("myEvent",true,true);
    self._initCMD();
    // custom param
}

VoiceCMD.prototype.subscribeVoiceEvent = function (fnEventHandler){
    document.addEventListener("myEvent",fnEventHandler,false);
}
// function of class
VoiceCMD.prototype._initCMD = function (){
    if (annyang) {
        console.log("init Voide Comand")
        annyang.addCommands(this._getCmds());
        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
    }
}

VoiceCMD.prototype._getCmds = function(){
    var self = this;
    return commands = {
            "hello": function(){
                console.log("Hello");
                self.evt.voiceCmd = "hello";
                document.dispatchEvent(self.evt);
            },
            "look at me": function(){
                console.log("look at me!!!!!!!!!!!!");
                self.evt.voiceCmd = "look at me"
                document.dispatchEvent(self.evt);
            },
             "go to the rock": function(){
                console.log("go to the rock")
                self.evt.voiceCmd = "go to the rock"
                document.dispatchEvent(self.evt);
            },
            "go to bed": function(){
                console.log("go to bed")
                self.evt.voiceCmd = "go to bed"
                document.dispatchEvent(self.evt);
            }
        };
}


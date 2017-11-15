var videoInput = document.getElementById('vid');
var canvasInput = document.getElementById('compare');
var canvasOverlay = document.getElementById('overlay')
var debugOverlay = document.getElementById('debug');
var overlayContext = canvasOverlay.getContext('2d');
canvasOverlay.style.position = "absolute";
canvasOverlay.style.top = '0px';
canvasOverlay.style.zIndex = '100001';
canvasOverlay.style.display = 'block';
debugOverlay.style.position = "absolute";
debugOverlay.style.top = '0px';
debugOverlay.style.zIndex = '100002';
debugOverlay.style.display = 'none';

// add some custom messaging

statusMessages = {
"whitebalance" : "checking for stability of camera whitebalance",
"detecting" : "Detecting face",
"hints" : "Hmm. Detecting the face is taking a long time",
"redetecting" : "Lost track of face, redetecting",
"lost" : "Lost track of face",
"found" : "Tracking face"
};

supportMessages = {
"no getUserMedia" : "Unfortunately, <a href='http://dev.w3.org/2011/webrtc/editor/getusermedia.html'>getUserMedia</a> is not supported in your browser. Try <a href='http://www.opera.com/browser/'>downloading Opera 12</a> or <a href='http://caniuse.com/stream'>another browser that supports getUserMedia</a>. Now using fallback video for facedetection.",
"no camera" : "No camera found. Using fallback video for facedetection."
};

document.addEventListener("headtrackrStatus", function(event) {
if (event.status in supportMessages) {
    //var messagep = document.getElementById('gUMMessage');
    //messagep.innerHTML = supportMessages[event.status];
    console.log("Status of face track"+ supportMessages[event.status])
} else if (event.status in statusMessages) {
    //var messagep = document.getElementById('headtrackerMessage');
    //messagep.innerHTML = statusMessages[event.status];
    console.log("Status of face track"+ statusMessages[event.status])
}
}, true);

//var event = document.createEvent('headTrack');
//evt = null;
    //event.initEvent('build', true, true);
var evt = document.createEvent("Event");
evt.initEvent("headTrack",true,true);

// the face tracking setup

var htracker = new headtrackr.Tracker({altVideo : {ogv : "./media/capture5.ogv", mp4 : "./media/capture5.mp4"}, calcAngles : true, ui : false, headPosition : false, debug : debugOverlay});
htracker.init(videoInput, canvasInput);
htracker.start();

// for each facetracking event received draw rectangle around tracked face on canvas

document.addEventListener("facetrackingEvent", function( event ) {
// clear canvas
console.log("the event is ", event);
// todo make to events
if(event.angle > 2){
    //left
    console.log("LEFT");
    evt.direction = "LEFT";
    document.dispatchEvent(self.evt);
    //$("#catImg").attr("src","imgs/catheadright.png");
}else if(event.angle < 1.3){
    console.log("RIGHT");
    evt.direction = "RIGHT";
    document.dispatchEvent(self.evt);
    //$("#catImg").attr("src","imgs/catheadleft.png");
}else if(event.angle >= 1.4 && event.angle <= 1.5){
    //$("#catImg").attr("src","imgs/cathead0.png");
    evt.direction = "CENTER";
    document.dispatchEvent(self.evt);
    
}
overlayContext.clearRect(0,0,320,240);
// once we have stable tracking, draw rectangle
if (event.detection == "CS") {
    overlayContext.translate(event.x, event.y)
    overlayContext.rotate(event.angle-(Math.PI/2));
    overlayContext.strokeStyle = "#00CC00";
    overlayContext.strokeRect((-(event.width/2)) >> 0, (-(event.height/2)) >> 0, event.width, event.height);
    overlayContext.rotate((Math.PI/2)-event.angle);
    overlayContext.translate(-event.x, -event.y);
}
});

function subscribeHeadTrackEvent(fnEventHandler){
    document.addEventListener("headTrack",fnEventHandler,false);
}

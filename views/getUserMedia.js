(function() {
  'use strict';
  const socket = io();
  var video = document.querySelector('video'), canvas;
  canvas = document.getElementById('canvas');
  // use MediaDevices API
  // docs: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  if (navigator.mediaDevices) {
    // access the web cam
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: {exact: 640}, height: {exact: 480} } })
    // permission granted:
      .then(function(stream) {
        video.srcObject = stream;
        var rafId;
        var CANVAS_WIDTH = canvas.width;
        var CANVAS_HEIGHT = canvas.height;
        var context;
        var fps = 1;
        var now;
        var then = performance.now();
        var interval = 1000/fps;
        var delta
        context = canvas.getContext('2d');
        function drawVideoFrame(time) {
          rafId = requestAnimationFrame(drawVideoFrame);
          now = performance.now();
          delta = now - then;
          if (delta > interval){
            then = now - (delta % interval);
            context.drawImage(video, 295.69, 187.09, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            var origData = context.getImageData(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
            for (var i = 0; i < origData.data.length; i+=4) {
              origData.data[i] = 0;
              origData.data[i+1] = 0;
              origData.data[i+3] = 0;
            }
            var sum = 0;
            for (var i = 0; i < origData.data.length; i++){
              sum = sum+origData.data[i];
            }
            socket.emit('sum',sum, CANVAS_WIDTH, CANVAS_HEIGHT);
          }
        };
        rafId = requestAnimationFrame(drawVideoFrame);
        socket.on('response',function(write){
          document.getElementById('p1').innerHTML = write;
        });
      })
      // permission denied:
      .catch(function(error) {
        document.body.textContent = 'Could not access the camera. Error: ' + error.name;
      });
  }
})();

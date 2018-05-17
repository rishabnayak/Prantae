(function() {
  'use strict';
  const socket = io();
  var video = document.querySelector('video'), canvas;
  canvas = document.getElementById('canvas');
  // use MediaDevices API
  function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
  }
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
            var channel = [];
            var sum = 0;
            var avg;
            var out;
            for (var i = 0; i < origData.data.length; i+=4) {
              origData.data[i] = 0;
              origData.data[i+1] = 0;
              origData.data[i+3] = 0;
            }
            for (var i = 0; i < origData.data.length; i++){
              sum = sum+origData.data[i];
            }
            avg = sum/(CANVAS_WIDTH*CANVAS_HEIGHT);
            out = avg.toFixed(2);
            socket.emit('output',out);
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

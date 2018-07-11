const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
  res.render('homepage.html');
  io.on('connection',function(socket){
      console.log('user connected');
      socket.on('sum', function(sum, CANVAS_WIDTH, CANVAS_HEIGHT){
        var avg;
        var out;
        var conc;
        avg = sum/(CANVAS_WIDTH*CANVAS_HEIGHT);
        conc = (avg-0.5557)/0.3883;
        var outconc = conc.toFixed(2);
        out = "The concentration is "+outconc+"mg/L"
        io.emit('response',out);
      });
  });
});
http.listen(8080, () => {
  console.log("View at localhost:8080");
});

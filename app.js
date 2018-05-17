const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cv = require('opencv2');

app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
  res.render('homepage.html');
});
io.on('connection',function(socket){
  console.log('user connected');
    socket.on('disconnect',() => {
      console.log('user disconnected');
    });
    socket.on('output', function(out){
        io.emit('response',out);
    });
});
http.listen(8080, () => {
  console.log("View at localhost:8080");
});

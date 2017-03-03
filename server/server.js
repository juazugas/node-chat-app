const path  = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newEmail', {
    from: 'mike@example.com',
    text: 'Hey. What is going on',
    date: new Date().toISOString()
  });

  socket.emit('newMessage', {
    from: 'Juan',
    text: 'Can we meet at 6?',
    createdAt: new Date().toISOString()
  });

  socket.on('createMessage', (data) => {
    console.log('createMessage:', data);
    socket.emit('newMessage', {
      createdAt: new Date().toISOString(), data
    });
  });

  socket.on('createEmail', (data) => {
    console.log('createEmail:', data);
  });

  socket.on('disconnect', (socket) => {
    console.log('User disconnected');
  });

});

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

module.exports = { app };

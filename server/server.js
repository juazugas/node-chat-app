const path  = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Chatbot', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Chatbot','New user joined'));

  socket.on('createMessage', (data, callback) => {
    console.log('createMessage:', data);
    io.emit('newMessage', generateMessage(data.from, data.text));
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords, callback) => {
    console.log('createLocationMessage:', coords);
    io.emit('newLocationMessage', generateLocationMessage('Chatbot', coords.latitude, coords.longitude));
    callback('This is location from the server');
  });

  socket.on('disconnect', (socket) => {
    console.log('User disconnected');
  });

});

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

module.exports = { app };

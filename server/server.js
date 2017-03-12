const path  = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {isRealString} = require('./utils/validation');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room name are required.');
    }

    socket.join(params.room)
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    console.log(`New user ${params.name}\\${socket.id} connected to ${params.room}`);

    io.to(params.room).emit('updateUsersList', users.getUsersList(params.room));
    socket.emit('newMessage', generateMessage('Chatbot', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Chatbot',`${params.name} has joined.`));

    callback();
  });

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

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      console.log(`User ${user.name}\\${socket.id} disconnected from ${user.room}`);
      console.log(users.getUsersList(user.room));
      io.to(user.room).emit('updateUsersList', users.getUsersList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Chatbot', `${user.name} has left.`));
    }
  });

});

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

module.exports = { app };

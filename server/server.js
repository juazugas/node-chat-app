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

    let room = params.room.toLowerCase()

    let userList = users.getUsersList(room);
    if (userList.includes(params.name)) {
      return callback(`Name ${params.name} yet used in Room.`);
    }

    socket.join(room)
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, room);
    console.log(`New user ${params.name}\\${socket.id} connected to ${room}`);

    io.to(room).emit('updateUsersList', users.getUsersList(room));
    socket.emit('newMessage', generateMessage('Chatbot', 'Welcome to the chat app'));
    socket.broadcast.to(room).emit('newMessage', generateMessage('Chatbot',`${params.name} has joined.`));

    callback();
  });

  socket.on('createMessage', (data, callback) => {
    let user = users.getUser(socket.id);
    if (user && isRealString(data.text)) {
      console.log('createMessage:', data, user);
      io.to(user.room).emit('newMessage', generateMessage(user.name, data.text));
    }
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords, callback) => {
    let user = users.getUser(socket.id);
    if (user) {
      console.log('createLocationMessage:', coords, user);
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
    callback('This is location from the server');
  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
    if (user) {
      console.log(`User ${user.name}\\${socket.id} disconnected from ${user.room}`);
      io.to(user.room).emit('updateUsersList', users.getUsersList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Chatbot', `${user.name} has left.`));
    }
  });

});

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

module.exports = { app };

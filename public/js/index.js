
  var socket = io();

  socket.on('connect', function () {
    console.log('connected to server');

    socket.emit('createEmail', {
      to: 'jen@example.com',
      text: 'Hey. This is Juan',
      date: new Date().toISOString()
    });

    socket.emit('createMessage', {
      from: 'Client',
      text: 'Hey, Is there anyone connected?'
    });
  });

  socket.on('disconnect', function () {
    console.log('disconnected from server');
  });

  socket.on('newEmail', function(data) {
    console.log('new email', data);
  });

  socket.on('newMessage', function(data) {
    console.log('new message', data);
  });

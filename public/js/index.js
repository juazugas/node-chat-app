
  var socket = io();

  socket.on('connect', function () {
    console.log('connected to server');
  });

  socket.on('disconnect', function () {
    console.log('disconnected from server');
  });

  socket.on('newMessage', function(message) {
    var momentTime = moment(message.createdAt);
    var relTime = momentTime.fromNow();
    var formattedTime = momentTime.format('h:mm a');

    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      formattedTime: formattedTime,
      relativeTime: relTime
    });

    jQuery('#messages').append(html);
  });

  socket.on('newLocationMessage', function (message) {
    var momentTime = moment(message.createdAt);
    var relTime = momentTime.fromNow();
    var formattedTime = momentTime.format('h:mm a');

    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
      text: 'My current location',
      from: message.from,
      formattedTime: formattedTime,
      relativeTime: relTime,
      url: message.url
    });

    jQuery('#messages').append(html);
  });

  jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('input[name=message]');
    socket.emit('createMessage', {
      from: 'User',
      text: messageTextbox.val()
    }, function (data) {
      console.log('send it', data);
      messageTextbox.val('');
    });
  });

  var locationBtn  = jQuery('#send-location');

  locationBtn.on('click', function (e) {
    locationBtn.attr('disabled', 'disabled');
    if (!navigator.geolocation) {
      return alert('Geolocation not supported by your browser');
    }

    locationBtn.text('Sending ...');
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }, function(data) {
        console.log('send it', data);
        locationBtn.removeAttr('disabled').text('Send location');
      });
    }, function () {
      alert('Unable to fetch the geolocation');
        locationBtn.removeAttr('disabled').text('Send location');
    });
  });

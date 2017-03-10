
  var socket = io();

  socket.on('connect', function () {
    console.log('connected to server');
  });

  socket.on('disconnect', function () {
    console.log('disconnected from server');
  });

  function getHtmlDateMessage(createdAt) {

    var momentTime = moment(createdAt);
    var relTime = momentTime.fromNow();
    var formattedTime = momentTime.format('h:mm a');

    var small = jQuery('<small></small>');
    small.text(formattedTime+' ');
    var italic = jQuery('<i></i>');
    italic.text(relTime);
    italic.appendTo(small);
    small.append('<br/>');

    return small;
  }

  socket.on('newMessage', function(message) {
    console.log('new message', message);

    var li = jQuery('<li></li>');

    li.text(message.from + ': ' + message.text);
    li.prepend(getHtmlDateMessage(message.createdAt));

    jQuery('#messages').append(li);
  });

  socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
    li.text(message.from + ': ');
    a.attr('href', message.url);
    li.append(a);
    li.prepend(getHtmlDateMessage(message.createdAt));

    jQuery('#messages').append(li);
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

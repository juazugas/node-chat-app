
  var socket = io();

  var scrollToBottom = function () {
    // Selectors and heights
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight  + lastMessageHeight >= scrollHeight) {
      messages.scrollTop(scrollHeight);
    }
  };

  socket.on('connect', function () {
    console.log('connected to server');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
      if (err) {
        alert(err);
        window.location.href = '/';
      } else {
        console.log('no error');
      }
    });
  });

  socket.on('disconnect', function () {
    console.log('disconnected from server');
  });

  socket.on('updateUsersList', function (users) {
    var params = jQuery.deparam(window.location.search);
    console.log('Users list', users);
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user) {
      var className = (params.name && params.name === user) ? 'active' : '';
      ol.append(jQuery('<li></li>').addClass(className).text(user));
    });

    jQuery('#users').html(ol);
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
    scrollToBottom();
  });

  socket.on('newLocationMessage', function (message) {
    var momentTime = moment(message.createdAt);
    var relTime = momentTime.fromNow();
    var formattedTime = momentTime.format('h:mm a');

    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
      from: message.from,
      formattedTime: formattedTime,
      relativeTime: relTime,
      url: message.url
    });

    jQuery('#messages').append(html);
    scrollToBottom();
  });

  jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('input[name=message]');
    socket.emit('createMessage', {
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

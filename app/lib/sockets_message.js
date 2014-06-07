'use strict';

var traceur = require('traceur');
var Message;

exports.connection = function(socket){
  Message = traceur.require(__dirname + '/../models/message.js');

  socket.on('send', send);
  console.log('Listening for Messages');
};

function send(data)
{
  console.log('Message received by socket_messages');
  var socket = this;

  Message.create(data, message=>
  {
    if(message)
    {
      sendMessage(message);
    }
    else
    {
      socket.send('message error');
    }
  });

  function sendMessage(msg)
  {
    socket.broadcast.emit(msg.recipientId, msg);
    socket.emit('sent', msg);
  }
}
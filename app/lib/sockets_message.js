'use strict';

var traceur = require('traceur');
var Message;
var User;

exports.connection = function(socket)
{
  socket.on('send', send);
};

function send(data)
{
  var socket = this;
  Message = traceur.require(__dirname + '/../models/message.js');
  User = traceur.require(__dirname + '/../models/user.js');

  User.findById(data.senderId, sender=>
  {
    console.log('SENDER');
    console.log(data.senderId);
    console.log(sender);
    if(sender)
    {
      User.findById(data.recipientId, recipient=>
      {
        if(recipient)
        {
          Message.create(data, message=>
          {
            if(message)
            {
              sendMessage(message);
            }
            else
            {
              socket.send('Message could not be processed by our server');
            }
          });
        }
        else
        {
          socket.send('Message recipient could not be verified');
        }
      });
    }
    else
    {
      socket.send('Message sender could not be verified');
    }
  });

  function sendMessage(msg)
  {
    socket.broadcast.emit(msg.recipientId, msg);
    socket.emit('sent', msg);
  }
}
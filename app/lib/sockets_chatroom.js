'use strict';

var traceur = require('traceur');
var User;

exports.connection = function(socket)
{
  socket.on('post', post);
};

function post(comment)
{
  var socket = this;
  User = traceur.require(__dirname + '/../models/user.js');

  User.findById(comment.senderId, user=>
  {
    if(user)
    {
      postToChatroom(comment);
    }
    else
    {
      socket.send('Please sign in to post to our chat rooms');
    }
  });

  function postToChatroom(comment)
  {
    socket.broadcast.emit(comment.topicId, comment);
    socket.emit(comment.topicId, comment);
  }
}
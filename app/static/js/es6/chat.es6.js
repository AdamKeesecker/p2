/* global io */

'use strict';

$(function()
{
  var socket;

  var userId = '539274c2f928054c0f91b875';
  var topicId = '098765432109876543210987';

  initializeSocketIo();

  // --------------------
  // This code will test the socket message functionality
  setTimeout(function()
  {
    var comment = {
      senderId: userId,
      topicId: topicId,
      message: 'Congratulations on posting your first comment'
    };
    postToChatroom(comment);
  }, 4000);
  // --------------------

  function postToChatroom(comment)
  {
    socket.emit('post', comment);
  }

  function newComment(comment)
  {
    if(comment.senderId === userId)
    {
      console.log('You have posted to the chatroom');
    }
    else
    {
      console.log('Someone else has posted to the chatroom');
    }
    console.log(comment);
  }

  function error(err)
  {
    console.log(err);
  }

  function initializeSocketIo()
  {
    socket = io.connect('/chat');
    socket.on(topicId, newComment);
    socket.on('message', error);
  }
});
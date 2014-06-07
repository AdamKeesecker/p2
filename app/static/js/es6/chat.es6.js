/* global io */

'use strict';

$(function()
{
  var socket;

  var userId = '123456789012345678901234';
  var topicId = '098765432109876543210987';

  initializeSocketIo();

  // --------------------
  // This code will test the socket message functionality
  var comment = {
    senderId: userId,
    topicId: topicId,
    message: 'Congratulations on posting your first comment'
  };
  postToChatroom(comment);
  // --------------------

  function postToChatroom(comment)
  {
    socket.emit('post', comment);
  }

  function newComment(comment)
  {
    console.log(comment);
    if(comment.senderId === userId)
    {
      console.log('You have posted to the chatroom');
    }
    else
    {
      console.log('Someone else has posted to the chatroom');
    }
  }

  function initializeSocketIo()
  {
    socket = io.connect('/chatroom');
    socket.on(topicId, newComment);
  }

  // function ajax(url, type, data={}, success=r=>console.log(r), dataType='html')
  // {
  //   $.ajax(
  //   {
  //     url: url,
  //     type: type,
  //     dataType: dataType,
  //     data: data,
  //     success: success
  //   });
  // }
});
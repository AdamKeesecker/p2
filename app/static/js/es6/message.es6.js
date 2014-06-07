/* global io */

'use strict';

$(function()
{
  var socket;

  var userId = '539330cabff7a022a2c22c3b';

  initializeSocketIo();

  // --------------------
  // This code will test the socket message functionality
  setTimeout(function()
  {
    var message = {
      senderId: userId,
      recipientId: '53922ab0c7a5ad4c9cb8543d',
      body: 'Congratulations on sending your first message'
    };
    sendMessage(message);
  }, 2000);
  // --------------------

  function sendMessage(msg)
  {
    socket.emit('send', msg);
  }

  function sentConfirmed(msg)
  {
    console.log('You have sent a message');
  }

  function receiveMessage(msg)
  {
    console.log(msg);
  }

  function error(err)
  {
    console.log(err);
  }

  function initializeSocketIo()
  {
    socket = io.connect('/message');
    socket.on('sent', sentConfirmed);
    socket.on('message', error);
    socket.on(userId, receiveMessage);
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

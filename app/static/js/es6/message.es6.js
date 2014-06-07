/* global io */
/* jshint unused: false */

'use strict';

$(function()
{
  var socket;

  var userId = '123456789012345678901234';

  initializeSocketIo();

  // // --------------------
  // // This code will test the socket message functionality
  // var message = {
  //   senderId: userId,
  //   recipientId: '098765432109876543210987',
  //   body: 'Congratulations on sending your first message'
  // };
  // sendMessage(message);
  // // --------------------

  // function sendMessage(msg)
  // {
  //   socket.emit('send', msg);
  // }

  // function sentConfirmed(msg)
  // {
  //   console.log(msg);
  // }

  // function recieveMessage(msg)
  // {
  //   console.log(msg);
  // }

  function initializeSocketIo()
  {
    socket = io.connect('/message');
    // socket.on(userId, recieveMessage);
    // socket.on('sent', sentConfirmed);
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
/* global io */

'use strict';

$(function()
{
  var socket;

  initializeSocketIo();

  // --------------------
  // This code will test the socket message functionality
  var message = {
    senderId: '123456789012345678901234',
    recipientId: '098765432109876543210987',
    body: 'Congratulations on sending your first message'
  };
  sendMessage(message);
  // --------------------

  function sendMessage(msg)
  {
    console.log('Sending...');
    socket.on('sent', sentConfirmed);
    socket.emit('send', msg);
  }

  function sentConfirmed(msg)
  {
    console.log('Send Confirmed');
    console.log(msg);

  }

  function initializeSocketIo(){
    socket = io.connect('/message');
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
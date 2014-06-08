/* jshint unused: false */
/* global io */

'use strict';

$(function()
{
  var socket;

  initializeSocketIo();

  var $modal = $('#messageModal');
  var $modalContent = $modal.find('.modal-content');
  var $openModal = $('#openMessageModal');

  var userId = $modal.attr('data-userid');

  $('body').on('click', '.view-chat', viewMessages);

  function viewMessages()
  {
    var recipientId = $(this).attr('data-recipientid');
    ajax(`/messages/${recipientId}`, 'GET', {}, h=>
    {
      $modalContent.html(h);
      $openModal.trigger('click');
    });
  }

  // --------------------
  // This code will test the socket message functionality
  setTimeout(function()
  {
    var message = {
      senderId: userId,
      recipientId: '5394b84ddb51659912cb6cb6',
      body: 'Congratulations on sending your first message'
    };
    sendMessage(message);
  }, 1000);
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
});

function ajax(url, type, data={}, success=r=>console.log(r), processData=true, contentType='application/x-www-form-urlencoded', dataType='html')
{
  $.ajax(
  {
    url: url,
    type: type,
    dataType: dataType,
    contentType: contentType,
    processData: processData,
    data: data,
    success: success
  });
}
/* jshint unused: false */
/* global io */

'use strict';

$(function()
{
  var socket;

  var $modal = $('#messageModal');
  var $modalContent = $modal.find('.modal-content');
  var $openModal = $('#openMessageModal');

  var userId = $modal.attr('data-userid');

  initializeSocketIo();

  $('body').on('click', '.view-chat', viewMessages);
  $modal.on('click', '#sendMessage', sendMessage);
  $modal.on('keydown', '#messageText', sendByKeyDown);

  function sendByKeyDown(e)
  {
    if(e.keyCode === 13)
    {
      sendMessage();
    }
  }

  function sendMessage()
  {
    var messageText = $('#messageText').val();
    if(messageText)
    {
      var message = {
        senderId: userId,
        recipientId: $('#sendMessage').attr('data-chatpartnerid'),
        body: messageText
      };
      sendMessageToServer(message);
    }
  }

  function viewMessages()
  {
    var recipientId = $(this).attr('data-recipientid');
    updateMessageHistory(recipientId, ()=>
    {
      $openModal.trigger('click');
    });
  }

  function updateMessageHistory(recipientId, fn=()=>{})
  {
    ajax(`/messages/${recipientId}`, 'GET', {}, h=>
    {
      if(h)
      {
        $modalContent.html(h);
        $('#messageText').focus();
        fn();
      }
    });
  }

  // --------------------
  // This code will test the socket message functionality
  // setTimeout(function()
  // {
  //   var message = {
  //     senderId: '5394b84ddb51659912cb6cb6',
  //     recipientId: userId,
  //     body: 'Congratulations on sending your first message'
  //   };
  //   sendMessageToServer(message);
  // }, 1000);
  // --------------------

  function sendMessageToServer(msg)
  {
    socket.emit('send', msg);
  }

  function sentConfirmed(msg)
  {
    updateMessageHistory(msg.recipientId);
  }

  function receiveMessage(msg)
  {
    updateMessageHistory(msg.senderId);
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
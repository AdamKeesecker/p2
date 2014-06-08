'use strict';

var traceur = require('traceur');
// var User = traceur.require(__dirname + '/../models/user.js');
var Message = traceur.require(__dirname + '/../models/message.js');
// var request = require('request');
// var multiparty = require('multiparty');
// var fssafe = traceur.require(__dirname + '/../lib/fssafe.js');
// var users = global.nss.db.collection('users');
// var _ = require('lodash');

exports.index = (req, res)=>
{
  var senderId = res.locals.user._id;
  var recipientId = req.params.recipientId;

  console.log('SENDERID');
  console.log(senderId);
  console.log('RECIPIENTID');
  console.log(recipientId);

  Message.getHistoryByIds(senderId, recipientId, messages=>
  {
    console.log('MESSAGES');
    console.log(messages);
    res.render('messages/index', {messages: messages});
  });
};
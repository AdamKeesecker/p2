'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Message = traceur.require(__dirname + '/../models/message.js');
// var request = require('request');
// var multiparty = require('multiparty');
// var fssafe = traceur.require(__dirname + '/../lib/fssafe.js');
// var users = global.nss.db.collection('users');
// var _ = require('lodash');

exports.index = (req, res)=>
{
  var userId = res.locals.user._id;
  var chatPartnerId = req.params.chatPartnerId;

  User.findById(chatPartnerId, chatPartner=>
  {
    if(chatPartner)
    {
      Message.getHistoryByIds(userId, chatPartnerId, messages=>
      {
        res.render('messages/index', {messages: messages, chatPartner: chatPartner});
      });
    }
    else
    {
      res.send();
    }
  });
};
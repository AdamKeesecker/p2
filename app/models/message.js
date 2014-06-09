'use strict';

//var bcrypt = require('bcrypt');

var messageCollection = global.nss.db.collection('messages');
var Mongo = require('mongodb');
//var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
//{"name":"IloveForking","email":"phil@aol.com", "password":"7890", "gender":"male", "age":"24", "location":"02134", "orientation":"female"}
class Message{
  static create(obj, fn){

    var message = new Message();
    
    message.senderId = Mongo.ObjectID(obj.senderId);
    message.recipientId = Mongo.ObjectID(obj.recipientId);
    message.body = obj.body;
    message.isRead = false;
    message.date = new Date();

    messageCollection.save(message, ()=>fn(message));
  }

  static findById(id, func){
    Base.findById(id, messageCollection, Message, func);
  }

  static findBySenderId(senderId, fn)
  {
    messageCollection.find({senderId: senderId}).toArray((e, messages)=>
    {
      fn(messages);
    });
  }

  static findByRecipientId(recipientId, fn)
  {
    messageCollection.find({recipientId: recipientId}).toArray((e, messages)=>
    {
      fn(messages);
    });
  }

  static getHistoryByIds(id1, id2, fn)
  {
    Message.getOneWayHistoryByIds(id1, id2, msgs1=>
    {
      Message.getOneWayHistoryByIds(id2, id1, msgs2=>
      {
        var messages = sortMessagesByDate(msgs1.concat(msgs2));
        fn(messages);
      });
    });
  }

  static getOneWayHistoryByIds(senderId, recipientId, fn)
  {
    senderId = Mongo.ObjectID(senderId);
    recipientId = Mongo.ObjectID(recipientId);

    messageCollection.find({senderId: senderId, recipientId: recipientId}).toArray((e, messages)=>
    {
      messages = sortMessagesByDate(messages);
      fn(messages);
    });
  }
}

function sortMessagesByDate(messages)
{
  return messages.sort((a,b)=>(a.date < b.date ? -1 : (a.date > b.date ? 1 : 0)));
}

module.exports = Message;
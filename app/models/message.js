//var bcrypt = require('bcrypt');
var messages = global.nss.db.collection('messages');
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

    messages.save(message, ()=>fn(message));
  }

  static findById(id, func){
    Base.findById(id, messages, Message, func);
  }

}
module.exports = Message;
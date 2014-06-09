'use strict';

var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');
// var Mongo = require('mongodb');
var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Message = traceur.require(__dirname + '/message.js');
//{"name":"IloveForking","email":"phil@aol.com", "password":"7890", "gender":"male", "age":"24", "location":"02134", "orientation":"female"}
var fssafe = traceur.require(__dirname + '/../lib/fssafe.js');

class User{
  editProfile(info)
  {
    for(var property in info)
    {
      if(this.hasOwnProperty(property))
      {
        this[property] = info[property];
      }
    }
  }

  deleteGame(gameId){
    //this.games 

    var filteredGames = _.filter(this.games, game=>{
      if(game.id !== gameId){
        return game;
      }
    });
    this.games = filteredGames;
    users.save(this, ()=>{});
  }

  saveGame(obj){
    this.games.push(obj);
    users.save(this, ()=>{});
  }

  save(fn)
  {
    if(this._id)
    {
      users.save(this, ()=>fn(this));
    }
    else
    {
      users.save(this, (e, user)=>fn(user));
    }
  }

  isOwner(ownerId)
  {
    if(ownerId && this)
    {
      return ownerId.toString() === this._id.toString();
    }
    return false;
  }

  storePhotos(photos)
  {
    if(photos)
    {
      var path = `/img/users/${this._id}`;
      fssafe.mkdirSafeSync(path);

      photos.forEach(p=>
      {
        if(p.originalFilename)
        {
          fssafe.renameSafeSync(p.path, `${path}/${p.originalFilename}`);
        }
      });
    }
  }

  getLastPerChatPartner(fn)
  {
    this.getPastChatPartners(partners=>
    {
      var lastMessages = [];
      var messagesLeft = partners.length;
      partners.forEach(partner=>
      {
        Message.getHistoryByIds(this._id, partner._id, messages=>
        {
          var lastMessage = messages[messages.length-1];
          lastMessages.push(lastMessage);

          if(!(--messagesLeft))
          {
            lastMessages = sortMessagesByDate(lastMessages);
            var lastChats = {
              messages: lastMessages,
              partners: partners
            };
            fn(lastChats);
          }
        });
      });
    });
  }

  getAllMessages(fn)
  {
    Message.findBySenderId(this._id, sent=>
    {
      Message.findByRecipientId(this._id, received=>
      {
        var messages = sent.concat(received);
        fn(messages);
      });
    });
  }

  getPastChatPartners(fn)
  {
    this.getAllMessages(messages=>
    {
      var partnerIds = _(messages).map(message=>
      {
        var isSender = message.senderId.toString() === this._id.toString();
        if(isSender)
        {
          return message.recipientId;
        }
        return message.senderId;
      }).map(id=>id.toString()).unique().value();

      var partners = [];
      var parntersLeft = partnerIds.length;
      partnerIds.forEach(partnerId=>
      {
        User.findById(partnerId, partner=>
        {
          partners.push(partner);
          if(!(--parntersLeft))
          {
            fn(partners);
          }
        });
      });
    });
  }

  setProfilePic(photo)
  {
    this.profilePic = photo;
  }

  get seeking()
  {
    switch(this.interestedIn)
    {
      case 'male':
        return 'Men';
      case 'female':
        return 'Women';
      default:
        return 'Men and women';
    }
  }

  get orientation(){
    if(this.gender === this.interestedIn){
      return 'gay';
    }
    if(this.interestedIn === 'both'){
      return 'bi';
    }
    else{
      return 'straight';
    }
  }

  static create(obj, fn){
    users.findOne({email:obj.email}, (e,u)=>{
      if(u){
        fn(null);
      }else{
        var user = new User();
        user.email = obj.email;
        user.password = bcrypt.hashSync(obj.password, 8);
        user.username = obj.username;
        user.gender = obj.gender;
        user.age = obj.age;
        user.about = '';
        user.genre = [];
        user.location = obj.location;
        user.interestedIn = obj.interestedIn;
        user.isOnline = true;
        user.relationshipStatus = undefined;
        user.profilePic = 'default2.jpeg';
        user.games = [];
        user.latlong = [];

        user.save(fn);
      }
    });
  }

  static login(obj, fn){
    users.findOne({email:obj.email}, (e,u)=>{
      if(u){
        var isMatch = bcrypt.compareSync(obj.password, u.password);
        if(isMatch){
          fn(u);
        }else{
          fn(null);
        }
      }else{
        fn(null);
      }
    });
  }

  static findById(id, func){
    Base.findById(id, users, User, func);
  }
}

function sortMessagesByDate(messages)
{
  return messages.sort((a,b)=>(a.date < b.date ? -1 : (a.date > b.date ? 1 : 0)));
}

module.exports = User;

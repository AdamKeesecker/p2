var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');
// var Mongo = require('mongodb');
var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
//{"name":"IloveForking","email":"phil@aol.com", "password":"7890", "gender":"male", "age":"24", "location":"02134", "orientation":"female"}
class User{

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
        user.genre = [];
        user.location = obj.location;
        user.orientation = obj.orientation;
        user.isOnline = true;
        user.relationshipStatus = undefined;
        user.coverPic = 'default.jpg';
        user.games = [];

        users.save(user, ()=>fn(user));
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

  get getOrientation(){
    if(this.gender === this.orientation){
      return 'gay';
    }
    if(this.orientation === 'both'){
      return 'bi';
    }
    else{
      return 'straight';
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
}
module.exports = User;

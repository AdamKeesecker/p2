var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
//var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
//{"name":"IloveForking","email":"phil@aol.com", "password":"7890", "gender":"male", "age":"24", "location":"02134", "orientation":"female"}
class User{
  get getOrientation(){
    if(this.gender === this.orientation){
      return 'gay';
    }
    if(this.orientation === 'both'){
      return 'bi';
    }
    return 'straight';
  }

  static create(obj, fn){
    users.findOne({email:obj.email}, (e,u)=>{
      if(u){
        fn(null);
      }else{
        var user = new User();
        user.email = obj.email;
        user._id = Mongo.ObjectID(obj._id);
        user.password = bcrypt.hashSync(obj.password, 8);
        user.name = obj.name;
        user.gender = obj.gender;
        user.age = obj.age;
        user.genre = [];
        user.location = obj.location;
        user.orientation = obj.orientation;
        user.isOnline = true;
        user.relationshipStatus = 'undefined';
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
}
module.exports = User;
/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'p2-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
//var factory = traceur.require(__dirname + '/../../helpers/factory.js');


var Message;
//var sue;

describe('Message', function(){
  before(function(done){
    db(function(){
      Message = traceur.require(__dirname + '/../../../app/models/message.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('messages').drop(function(){
      //factory('user', function(users){
        done();
      //});
    });
  });
  //ObjectId("538a6adf7dffbd9f76155c28")

  describe('.create', function(){
    it('should successfully create a message', function(done){
      Message.create({senderId: '538a6adf7dffbd4276155c28', recipientId: '428a6adf7dffbd9f76155c28', body: 'I think i am in lurrrrrrrrve.'}, function(msg){
        expect(msg).to.be.ok;
        expect(msg).to.be.an.instanceof(Message);
        expect(msg._id).to.be.an.instanceof(Mongo.ObjectID);
        done();
      });
    });

  //   it('should NOT successfully create a user', function(done){
  //     User.create({email:'sue@aol.com', password:'does not matter'}, function(u){
  //       expect(u).to.be.null;
  //       done();
  //     });
  //   });
  // });

  // describe('.login', function(){
  //   it('should successfully login a user', function(done){
  //     User.login({email:'stewart@aol.com', password:'1234'}, function(u){
  //       expect(u).to.be.ok;
  //       done();
  //     });
  //   });

  //   it('should NOT login user - bad email', function(done){
  //     User.login({email:'wrong@aol.com', password:'abcd'}, function(u){
  //       expect(u).to.be.null;
  //       done();
  //     });
  //   });

  //   it('should NOT login user - bad password', function(done){
  //     User.login({email:'sue@aol.com', password:'wrong'}, function(u){
  //       expect(u).to.be.null;
  //       done();
  //     });
  //   });

  //   it('should return a user from a cookie Id', function(done){
  //     User.findById('12345abc678274653acdbe54', function(u){
  //       expect(u).to.be.ok;
  //       expect(u).to.be.an.instanceof(User);
  //       //expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
  //       expect(u.password).to.have.length(60);
  //       done();
  //     });
  //   });

  //   it('should NOT return a user', function(done){
  //     User.findById('123456789111', function(u){
  //       expect(u).to.be.null;
  //       done();
  //     });
  //   });

   });

});
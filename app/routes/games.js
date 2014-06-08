'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var request = require('request');

exports.index = (req,res)=>{
  res.render('games/index', {title: 'Games'});
};

exports.find = (req, res)=>{
  var game = req.params.game;
  request('http://www.giantbomb.com/api/search/?api_key=29aa8adf95f48bba35259a53d0bf5516c3b6e529&format=json&query="'+game+'"&resources=game', (error, response, body)=>
  {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body);
      res.render('games/info', {games: body.results});
    }
  });
};

exports.add = (req, res)=>{
  User.findById(req.session.userId, user=>{
    user.saveGame(req.body);
    res.render('users/currentFavorites', {user: user});
  });
};

exports.remove = (req, res)=>{
  User.findById(req.session.userId, user=>{
    user.deleteGame(req.params.gameId);
    User.findById(req.session.userId, usr=>{
      res.render('users/currentFavorites', {user: usr});
    });
  });
};
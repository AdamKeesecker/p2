'use strict';
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var request = require('request');

exports.index = (req,res)=>{
	res.render('users/index', {title: 'P2'});
};

exports.register = (req, res)=>{
	User.create(req.body, user=>{
		req.session.userId = user._id;
		res.redirect('/users/dashboard');
	});
};

exports.login = (req, res)=>{
	User.login(req.body, usr=>{
		req.session.userId = usr._id;
		res.redirect('/users/dashboard');
	});
};

exports.loadDashboard = (req, res)=>{
	res.render('users/dashboard', {title: 'P2'});
};

exports.lookup = (req, res, next)=>{
	User.findById(req.session.userId, user=>{
		res.locals.user = user;
		next();
	});
};

exports.profile = (req, res)=>{
	res.render('users/profile', {title: 'P2'});
};

//'http://www.giantbomb.com/api/search/?api_key=29aa8adf95f48bba35259a53d0bf5516c3b6e529&format=json&query="'+game+'"&resources=game'
exports.findGame = (req, res)=>{
	var game = req.params.game;
	request('http://www.giantbomb.com/api/search/?api_key=29aa8adf95f48bba35259a53d0bf5516c3b6e529&format=json&query="'+game+'"&resources=game', function (error, response, body) {
	  if (!error && response.statusCode === 200) {
	  	body = JSON.parse(body);
	  	res.render('users/gameInfo', {games: body.results});
	  }
	});
};

exports.saveGame = (req, res)=>{
	User.findById(req.session.userId, user=>{
		user.saveGame(req.body);
		res.render('users/currentFavorites', {user: user});
	});
};



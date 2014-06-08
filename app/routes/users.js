'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var request = require('request');
var users = global.nss.db.collection('users');
var _ = require('lodash');


exports.index = (req,res)=>{
	res.render('users/index', {title: 'P2'});
};

exports.register = (req, res)=>{
	User.create(req.body, user=>{
		var location = req.body.location.split(',').map(each=> each.trim());
		request('https://maps.googleapis.com/maps/api/geocode/json?address='+ location[0] +'+'+ location[1]+'&key=AIzaSyA8KZBmouKCevsWQ0QI_IvP53iVL_fFDVk', function (error, response, body) {
		  if (!error && response.statusCode === 200) {
		  	body = JSON.parse(body);
		  	var latitude = body.results[0].geometry.location.lat;
		  	var longitude = body.results[0].geometry.location.lng;
		  	user.latlong.push(latitude, longitude);
		  	users.save(user, ()=>{
		  		req.session.userId = user._id;
					res.redirect('/users/dashboard');
		  	});
		  }
		});
	});
};

exports.filterMatches = (req, res)=>{
	User.findById(req.session.userId, user=>{
		users.find({latlong: {$geoWithin: {$centerSphere: [user.latlong, (req.body.distance*1)/3959]}}}).toArray((err, userArr)=>{
			var matches = _.filter(userArr, {'gender': req.body.sex});
			matches = _.filter(matches, {'orientation': req.body.orientation});
			res.render('users/filteredMatches', {users: matches});
		});
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
	res.render('users/profile', {ownerId: req.params.userId, title: 'P2'});
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

exports.browse = (req, res)=>{
	res.render('users/browse', {title: 'Find your p2!'});
};

exports.deleteGame = (req, res)=>{
	User.findById(req.session.userId, user=>{
		user.deleteGame(req.params.gameId);
			User.findById(req.session.userId, usr=>{
				res.render('users/currentFavorites', {user: usr});
			});
	});
};

exports.saveGame = (req, res)=>{
	User.findById(req.session.userId, user=>{
		user.saveGame(req.body);
		res.render('users/currentFavorites', {user: user});
	});
};

exports.logout = (req, res)=>
{
	req.session.userId = null;
	res.redirect('/');
};

exports.editInfo = (req, res)=>
{
	var user = res.locals.user;
	user.editInfo(req.body);
	user.save(user=>res.render('users/profile/info', {ownerId: user._id.toString()}));
};

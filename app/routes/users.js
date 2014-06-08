'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var request = require('request');
var multiparty = require('multiparty');
var fssafe = traceur.require(__dirname + '/../lib/fssafe.js');

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
	User.findById(req.params.userId, owner=>
	{
		res.render('users/profile', {owner: owner, photos: getPhotos(owner._id), title: 'P2'});
	});
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

exports.editProfile = (req, res)=>
{
	var user = res.locals.user;
	user.editProfile(req.body);
	user.save(user=>res.render(`users/profile/${req.body.category}`, {owner: user}));
};

exports.addPhotos = (req, res)=>
{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>
  {
    var photos = [];
    files.photos.forEach(photo=>
    {
      photos.push(photo);
    });
    var user = res.locals.user;
  	user.storePhotos(photos);
    renderModalPhotos(user, res);
  });
};

exports.deletePhoto = (req, res)=>
{
  var user = res.locals.user;
	fssafe.unlinkSync(__dirname + '/../static/img/users/' + user._id + '/' + req.params.photo);
  renderModalPhotos(user, res);
};

exports.setProfilePic = (req, res)=>
{
	var user = res.locals.user;
	user.setProfilePic(req.params.photo);
	user.save(user=>res.render('users/profile/pic', {owner: user}));
};

function getPhotos(userId)
{
	var directory = `/img/users/${userId}`;
  var photos = fssafe.readdirSafeSync(directory);
  return photos;
}

function renderModalPhotos(user, res)
{
  res.render('users/profile/photos', {photos: getPhotos(user._id)});
}
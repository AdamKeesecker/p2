'use strict';
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.register = (req, res)=>{
	User.create(req.body, user=>{
		req.session.userId = user._id;
		res.render('users/dashboard', {title: user.name, user:user});
	});
};

exports.login = (req, res)=>{
	User.login(req.body, usr=>{
		req.session.userId = usr._id;
		res.render('users/dashboard', {title: usr.name, user:usr});
	});	
};
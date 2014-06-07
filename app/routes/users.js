'use strict';
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.register = (req, res)=>{
	User.create(req.body, user=>{
		req.session.userId = user._id;
		res.redirect(`/users/dashboard`);
	});
};

exports.login = (req, res)=>{
	User.login(req.body, usr=>{
		req.session.userId = usr._id;
		res.redirect(`/users/dashboard`);
	});	
};

exports.loadDashboard = (req, res)=>{
	User.findById(req.session.userId, user=>{
		res.render('users/dashboard', {title: user.name, user:user});
	});	
};

exports.lookup = (req, res, next)=>{
	User.findById(req.session.userId, user=>{
		res.locals.user = user;
		next();
	});
};
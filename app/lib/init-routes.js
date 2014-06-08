'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  // Add a new route, var games

  app.all('*', users.lookup);

  app.get('/', dbg, home.index);

  app.post('/register', dbg, users.register);
  app.post('/login', dbg, users.login);
  app.get('/users/dashboard', dbg, users.loadDashboard);
  app.get('/users', dbg, users.index);

  // See comment above ^^^ Add a games route

  app.get('/users/find-game/:game', dbg, users.findGame);
  app.get('/logout', dbg, users.logout);
  app.put('/users/saveGame', dbg, users.saveGame);
  app.get('/users/browse', dbg, users.browse);
  app.get('/users/:userId', dbg, users.profile);
  app.delete('/users/deleteGame/:gameId', dbg, users.deleteGame);
  app.put('/users', dbg, users.editProfile);
  app.post('/users/photos', dbg, users.addPhotos);
  app.delete('/users/photos/:photo', dbg, users.deletePhoto);
  app.put('/users/photos/:photo', dbg, users.setProfilePic);

  console.log('Routes Loaded');
  fn();
}

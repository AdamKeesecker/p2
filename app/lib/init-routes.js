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

  app.get('/', dbg, home.index);

  // app.post('/register', dbg, users.register);
  // app.get('/login', dbg, users.login);
  // app.get('/users/:userId', dbg, users.view);
  // app.get('/users', dbg, users.index);
  


  console.log('Routes Loaded');
  fn();
}

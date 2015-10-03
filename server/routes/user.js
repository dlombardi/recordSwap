var passport = require('passport');
var Account = require('../models/user');
var Record = require('../models/record');


module.exports = function (app) {

  /*login register routes*/

  app.get('/', function (req, res) {
    Account.find({}, function(err, users){
      console.log(err);
      res.send(users);
      console.log(users);
    });
  });

  app.get('/register', function(req, res) {
      res.render('register', {});
  });

  app.post('/register', function(req, res) {
    console.log('req.body', req.body);

    var password = req.body.password;
    Account.register(new Account(req.body), password, function(err, account) {
      if (err) {
        console.log(err);
      }

      passport.authenticate('local')(req, res, function () {
        res.send(req.body);
      });
    });
  });

  app.get('/login', function(req, res) {
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
      console.log(req.body);
      Account.findOne({username: req.body.username}, function(err, account){
        res.send(account);
        console.log(account);
      });
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/ping', function(req, res){
      res.send("pong!", 200);
  });
}
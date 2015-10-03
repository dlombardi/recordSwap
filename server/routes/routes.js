var passport = require('passport');
var Account = require('../models/user');
var Record = require('../models/record')

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
          // return res.render('register', { account : account });
      }

      passport.authenticate('local')(req, res, function () {
        res.send(req.body);
      });
    });
  });

  app.get('/login', function(req, res) {
      // res.render('login', { user : req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
      console.log(req.body);
      Account.findOne({username: req.body.username}, function(err, account){
        res.send(account);
        console.log(account);
      });
      // res.redirect('/');
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/ping', function(req, res){
      res.send("pong!", 200);
  });


  app.post('/addRecord', function(req, res){
    Account.findById(req.body.user, function(err, user){
      console.log("adding record", req.body);
      var record = new Record(req.body);
      user.records.push(record);
      user.save();
      record.save(function(err, savedApartment){
        res.send(savedApartment);
      });
    });
  });
  app.delete('/deleteRecord', function(req, res){
    Record.findById(req.body.rid, function(err, record) {
      Account.findById(record.user, function(err, user){
        user.records.splice(user.records.indexOf(record), 1);
        user.save();
      });
    });
    Record.findByIdAndRemove(req.body.rid, function(err){
      res.send("Record successfully removed!");
    });
  });


  app.get('/record', function(req, res){
    if(req.query.rid !== undefined) {
      Record.findById(req.query.rid, function(err, record){
        res.send(record);
      });
    }
    else {
      Record.find({isAvailable: true}, function(err, records){
        res.send(records);
      })
    }
  })

  app.post('/pendingApproval', function(req, res){
    Account.findById(req.body.uid, function(err, user){
      Apartment.findById(req.body.aid, function(err, apartment){
        console.log(apartment);
        apartment.applicants.push(user);
        apartment.save();
        res.send("ok");
      });
    });
  });

  /*admin routes*/

  /*add a manager*/
  app.post('/addManager', function(req, res){
    Account.findById(req.body.uid, function(err, user){
     Property.findById(req.body.pid, function(err, property){
       property.manager = user;
        res.send("ok");
      });
    });
  });

/*delete a manager*/
 app.delete('/deleteManager', function(req, res){
   Account.findById(req.body.uid, function(err, user){
     Property.findById(req.body.pid, function(err, property){
       if(property.manager.toString() === user._id.toString()){
        property.manager = null;
        apartment.save();
       }
     });
   });
 });


 app.get('/showUsers', function(req, res){
   Account.find({}, function(err, users){
     res.send(users);
   })
 });
};

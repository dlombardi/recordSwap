var passport = require('passport');
var Account = require('../models/user');
var Record = require('../models/record');
var Trade = require('../models/trade');

module.exports = function (app) {

  /*login register routes*/

  app.get('/', function (req, res) {
    Account.find({}, function(err, users){
      console.log(err);
      res.send(users);
      console.log(users);
    });
  });

  app.get('/user', function (req, res) {
    Account.findById(req.query.uid, function(err, account) {
      Record.populate(account, {path: "records"}, function(err, populated) {
        res.send(populated);
      });
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

  app.post('/login', passport.authenticate('local'), function(req, res) {
      console.log(req.body);
      Account.findOne({username: req.body.username}, function(err, account){
        Record.populate(account, {path: "records"}, function(err, populated) {
          res.send(populated);
        });
      });
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
      record.save(function(err, record){
        res.send(record);
      });
    });
  });

  app.delete('/deleteRecord', function(req, res){
    if(req.body.rid === undefined) {
      req.body.rid = req.query.rid;
    }
    Record.findById(req.body.rid, function(err, record) {
      if(err) {
        res.status(400).send("Record not found!");
        return;
      }
      Account.findById(record.user, function(err, user){
        user.records.splice(user.records.indexOf(record), 1);
        user.save();
      });
    });
    Record.findByIdAndRemove(req.body.rid, function(err){
      if(err) {
        res.status(400).send("Record not found!");
        return;
      }
      res.send("Record successfully removed!");
    });
  });

  app.get('/trade', function(req, res){
    Trade.find({}, function(err,trades){
      res.send(trades);
    })
  })


  app.get('/record', function(req, res){
    if(req.query.rid !== undefined) {
      Record.findById(req.query.rid, function(err, record){
        if(err) {
          res.status(400).send("Record not found!");
          return;
        }
        res.send(record);
      });
    }
    else {
      Record.find({isAvailable: true}, function(err, records){
        res.send(records);
      });
    }
  });


  // After trading item delete all pending trades
  app.get('/trade', function(req, res){
    Trade.find({}, function(err,trades){
      res.send(trades);
    })
  })

  app.post('/trade', function(req, res){
    var trade = new Trade(req.body);
    trade.save();
    res.send(trade);
  });

  app.post('/acceptTrade', function(req, res){
    Trade.findById(req.body.tid, function(err, trade) {
      Trade.populate(trade, [
        {path: "sender"},
        {path: "receiver"},
        {path: "receiverRecords"},
        {path: "senderRecords"}],
        function(err, popTrade) {
          Account.update(
          {_id: trade.sender},
          {$pushAll: {records: trade.receiverRecords}},
          function(err) {
            popTrade.receiverRecords.forEach(function(record) {
              record.user = trade.sender._id;
              record.save();
              trade.receiver.records = trade.receiver.records.filter(function(rec) {
                console.log(rec, record._id.toString());
                if(rec== record._id.toString()) {
                  console.log("remove!", rec)
                  return false;
                }
                return true;
              });
              trade.receiver.save();
            });
          });
        Account.update(
          {_id: trade.receiver},
          {$pushAll: {records: trade.senderRecords}},
          function(err) {
            popTrade.senderRecords.forEach(function(record) {
              record.user = trade.receiver._id;
              record.save();
              console.log("Sender Records", trade.sender.records)
              trade.sender.records = trade.sender.records.filter(function(rec) {

                if(rec == record._id.toString()) {

                  return false;
                }
                return true;
              });
              trade.sender.save();
            });
          });
          trade.completed = true;
          trade.save();
          res.send(trade);
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
};

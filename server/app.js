var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
// Connect to DB


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());


// dependencies
var fs = require('fs');
var http = require('http');
var routes = require('./routes');

var LocalStrategy = require('passport-local').Strategy;

// global config

var corsMiddleware = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
};

app.use(corsMiddleware);
app.set('port', process.env.PORT || 1337);


var flash = require('connect-flash');
app.use(flash());

// env config

var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost/apartmentManager');

require('./routes/routes')(app);


// mongo config
// var MONGOLAB_URI= "add_your_mongolab_uri_here"
// var mongo = process.env.MONGOLAB_URI || 'mongodb://localhost/node-bootstrap3-template'
// mongoose.connect(mongo);

// mongo model
// var Model_Name = require('add_your_models_here');

// routes
// app.get('/', routes.index);
app.get('/ping', routes.ping);

// run server
app.listen(app.get('port'), function(){
  console.log('\nExpress server listening on port ' + app.get('port'));
});

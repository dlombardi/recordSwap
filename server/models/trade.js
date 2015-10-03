var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var User = require('./user');
var Record = require('./record');

var tradeSchema = new Schema({
  sender: {type: Mongoose.Schema.ObjectId , ref: 'User'},
  receiver: {type: Mongoose.Schema.ObjectId , ref: 'User'},
  record: {type: Mongoose.Schema.ObjectId , ref: 'Record'},
  date: {type: Date, default: Date.now()}
});

var Trade = Mongoose.model("Trade", tradeSchema);

module.exports = Trade;

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var User = require('./user');
var Record = require('./record');

var tradeSchema = new Schema({
  sender: {type: Mongoose.Schema.ObjectId , ref: 'User', required: true},
  receiver: {type: Mongoose.Schema.ObjectId , ref: 'User', required: true},
  senderRecords: [{type: Mongoose.Schema.ObjectId , ref: 'Record', required: true}],
  receiverRecords: [{type: Mongoose.Schema.ObjectId , ref: 'Record'}],
  completed: {type: Boolean, default: false},
  date: {type: Date, default: Date.now()}
});

var Trade = Mongoose.model("Trade", tradeSchema);

module.exports = Trade;

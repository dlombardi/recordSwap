var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var User = require('./user');

var recordSchema = new Schema({
 	user: {type: Mongoose.Schema.ObjectId , ref: 'User'},
  artist: {type: String, require: true},
  recordname: {type: String, require: true},
  condition: {type: String, require: true},
  picture: {type: String, require: true},
  isAvailable: {type: Boolean, default: true}
});

var Record = Mongoose.model("Record", recordSchema);

module.exports = Record;

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Record = require('./record');

var userSchema = new Schema({
  fullName: {type: String, required: true},
  username: {type: String, required: true},
  email: {type: String, required: true},
  records: [{type: Mongoose.Schema.ObjectId , ref: 'Record'}],

});

userSchema.plugin(passportLocalMongoose);

var User = Mongoose.model("User", userSchema);

module.exports = User;

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var User = require('./user');
var Property = require('./property');

var propertySchema = new Schema({
  manager: {type: Mongoose.Schema.ObjectId , ref: 'User'},
  apartments: [],
  name: String,
  address: String,
  picture: String
});

var Property = Mongoose.model("Property", propertySchema);

module.exports = Property;

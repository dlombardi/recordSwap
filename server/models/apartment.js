var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var Property = require('./property');

var apartmentSchema = new Schema({
  property: {type: Mongoose.Schema.ObjectId , ref: 'Property', required: true},
  aptNum: {type: String, required: true},
  rent: {type: Number, required: true},
  bedrooms: Number,
  bathrooms: Number,
  rentDue: Date,
  sqrfoot: Number,
  isAvailable: {type: Boolean, default: true},
  picture: String,
  tenants: [],
  applicants: []
});

var Apartment = Mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;

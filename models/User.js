var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    name : { type: String, unique: true },
    password : String,
    email : String,
    type: String,
    active: Boolean
});

module.exports = mongoose.model('User', User);
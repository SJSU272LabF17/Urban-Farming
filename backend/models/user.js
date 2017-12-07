var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    isDeleted: Boolean,
    isVerified: Boolean,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String
});

module.exports = mongoose.model('users', userSchema);

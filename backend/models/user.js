var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    isDeleted: Boolean,
    isVerified: Boolean,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    //
    dateOfBirth: Date,
    ssn: String,
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    phoneNumber: String,
    occupation: String,
    education: String,
    pastExperience: String,
    createdDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('users', userSchema);

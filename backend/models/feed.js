var mongoose = require("mongoose");

var feedSchema = new mongoose.Schema({
    isDeleted : Boolean,
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    content : String,
    contactViaPhone : Boolean,
    contactViaEmail : Boolean,
    photos : [String],
    createdDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('feeds', feedSchema);

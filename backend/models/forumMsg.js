var mongoose = require("mongoose");

var forumMsgSchema = new mongoose.Schema({
    isDeleted : Boolean,
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    topic : {type: mongoose.Schema.Types.ObjectId, ref: 'forumTopics'},
    message: String,
    createdDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('forumMsgs', forumMsgSchema);

var mongoose = require("mongoose");

var forumTopicSchema = new mongoose.Schema({
    isDeleted : Boolean,
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    title: String,
    createdDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('forumTopics', forumTopicSchema);

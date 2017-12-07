var mongoose = require("mongoose");

var proposalMsgSchema = new mongoose.Schema({
    isDeleted : Boolean,
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    proposal : {type: mongoose.Schema.Types.ObjectId, ref: 'proposals'},
    message: String,
    createdDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('proposalMsgs', proposalMsgSchema);

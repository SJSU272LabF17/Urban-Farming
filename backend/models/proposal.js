var mongoose = require("mongoose");

var proposalSchema = new mongoose.Schema({
    isDeleted : Boolean,
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    coverLetter: String,
    proposedUses: String,
    plannedOperations: String,
    farm:{type: mongoose.Schema.Types.ObjectId, ref: 'farms'},
    invitedUsers:[{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    status: String, //DRAFT-SUBMITTED-ACCEPTED-REJECTED-ENDED-TERMINATED
    createdDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('proposals', proposalSchema);

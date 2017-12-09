var Proposal = require('../models/proposal');
var ProposalMsg = require('../models/proposalMsg');
var Farm = require('../models/farm');

function createProposal(req,res){
    Proposal.find({
        isDeleted:false,
        farm:req.body.farm,
        //should add status also???
        $or:[{
            createdBy:req.session.passport.user.id
        },{
            invitedUsers:{$in:[req.session.passport.user.id]}
        }]
    }).exec(function(err, proposals){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            if(proposals.length > 0){
                return res.status(400).json({status: 400, statusText: "You are already involved in a proposal to this farm"});
            } else {
                var proposalModel = new Proposal();
                proposalModel.coverLetter = req.body.coverLetter;
                proposalModel.proposedUses = req.body.proposedUses;
                proposalModel.plannedOperations = req.body.plannedOperations;
                proposalModel.farm = req.body.farm;
                proposalModel.farmOwner = req.body.farmOwner;
                proposalModel.createdBy = req.session.passport.user.id;
                if(req.body.asDraft){
                    proposalModel.status = 'DRAFT';
                } else {
                    proposalModel.status = 'SUBMITTED';
                }
                proposalModel.invitedUsers = [];
                req.body.invitedUsers.forEach(function(obj) {
                    proposalModel.invitedUsers.push(obj._id);
                });
                proposalModel.isDeleted = false;
                var date = new Date();
                proposalModel.createdDate = date;
                proposalModel.updatedDate = date;
                proposalModel.save(function(err, proposal) {
                    if (err) {
                        return res.status(500).json({status: 500, statusText: err.message});
                    } else {
                        return res.status(200).json({status: 200, statusText: "Success",data:{_id:proposal._id}});
                    }
                });
            }
        }
    });
}

function updateProposal(req,res){
    var updateObj = {
        coverLetter : req.body.coverLetter,
        proposedUses : req.body.proposedUses,
        plannedOperations : req.body.plannedOperations,
        updatedDate : new Date()
    };
    updateObj.invitedUsers = [];
    req.body.invitedUsers.forEach(function(obj) {
        updateObj.invitedUsers.push(obj._id);
    });
    if(req.body.asDraft){
        updateObj.status = 'DRAFT';
    } else {
        updateObj.status = 'SUBMITTED';
    }
    Proposal.update({
        _id: req.params.id
    }, updateObj, function(err, result){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success"});
        }
    });
}

function deleteProposal(req,res){
    Proposal.update({
        _id: req.params.id,
        createdBy: req.session.passport.user.id,
        status: "DRAFT"
    }, {
        isDeleted: true,
        updatedDate : new Date()
    }, function(err, result){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success"});
        }
    });
}

function getProposals(req,res){
    if(req.session.passport.user.role === "FARMER") {
        if(req.query.type === "invitations") {
            Proposal.find({
                invitedUsers:{$in:[req.session.passport.user.id]},
                isDeleted: false
            }).select({
                _id: true,
                status: true,
                farm: true,
                invitedUsers: true,
                createdBy: true
            }).populate({
                path: 'farm',
                model: 'farms',
                select: 'streetAddress city state zipCode owner -_id',
                populate: {
                    path: 'owner',
                    model: 'users',
                    select: 'firstName lastName -_id'
                }
            }).populate({
                path: 'invitedUsers',
                model: 'users',
                select: 'firstName lastName -_id'
            }).populate({
                path: 'createdBy',
                model: 'users',
                select: 'firstName lastName -_id'
            }).exec(function (err, proposals) {
                if (err) {
                    return res.status(500).json({status: 500, statusText: err.message});
                } else {
                    return res.status(200).json({status: 200, statusText: "Success", data: proposals});
                }
            });
        } else {
            Proposal.find({
                createdBy: req.session.passport.user.id,
                isDeleted: false
            }).select({
                _id: true,
                status: true,
                farm: true,
                invitedUsers: true
            }).populate({
                path: 'farm',
                model: 'farms',
                select: 'streetAddress city state zipCode owner -_id',
                populate: {
                    path: 'owner',
                    model: 'users',
                    select: 'firstName lastName -_id'
                }
            }).populate({
                path: 'invitedUsers',
                model: 'users',
                select: 'firstName lastName -_id'
            }).exec(function (err, proposals) {
                if (err) {
                    return res.status(500).json({status: 500, statusText: err.message});
                } else {
                    return res.status(200).json({status: 200, statusText: "Success", data: proposals});
                }
            });
        }
    } else {
        Proposal.find({
            isDeleted: false,
            status:{$ne:'DRAFT'},
            farmOwner: req.session.passport.user.id
        }).select({
            _id: true,
            status: true,
            farm: true,
            invitedUsers: true,
            createdBy: true
        }).populate({
            path: 'farm',
            model: 'farms',
            select: 'streetAddress city state zipCode -_id'
        }).populate({
            path: 'invitedUsers',
            model: 'users',
            select: 'firstName lastName -_id'
        }).populate({
            path: 'createdBy',
            model: 'users',
            select: 'firstName lastName -_id'
        }).exec(function (err, proposals) {
            if (err) {
                return res.status(500).json({status: 500, statusText: err.message});
            } else {
                return res.status(200).json({status: 200, statusText: "Success", data: proposals});
            }
        });
    }
}

function getProposalById(req,res){
    Proposal.findOne({
        _id: req.params.id,
        isDeleted: false,
        $or:[{
            createdBy: req.session.passport.user.id
        },{
            invitedUsers:{$in:[req.session.passport.user.id]}
        },{
            farmOwner: req.session.passport.user.id
        }]
    }).select({
        _id: true,
        status: true,
        farm: true,
        farmOwner: true,
        createdBy: true,
        invitedUsers: true,
        coverLetter: true,
        proposedUses: true,
        plannedOperations: true
    }).populate({
        path: 'farm',
        model: 'farms',
        select: 'streetAddress city state zipCode owner location size waterConn waterAlternative appliedWaterConn existingStructures _id',
        populate: {
            path: 'owner',
            model: 'users',
            select: 'firstName lastName -_id'
        }
    }).populate({
        path: 'createdBy',
        model: 'users',
        select: 'firstName lastName _id'
    }).populate({
        path: 'invitedUsers',
        model: 'users',
        select: 'firstName lastName _id'
    }).exec(function (err, proposal) {
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            if(proposal) {
                return res.status(200).json({status: 200, statusText: "Success", data: proposal});
            }
            return res.status(404).json({status: 404, statusText: "Not found"});
        }
    });
}

function takeProposalAction(req,res){
    Proposal.update({
        _id: req.params.id,
        farmOwner: req.session.passport.user.id,
        status: "SUBMITTED"
    }, {
        status: req.body.status,
        updatedDate : new Date()
    }, function(err, result){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            if(req.body.status === 'ACCEPTED'){
                Farm.update({
                    _id: req.body.farmId,
                    owner: req.session.passport.user.id
                }, {
                    status: "IN CONTRACT",
                    updatedDate : new Date()
                }, function(err, result){
                    if (err) {
                        return res.status(500).json({status: 500, statusText: err.message});
                    } else {
                        return res.status(200).json({status: 200, statusText: "Success"});
                    }
                });
            } else {
                return res.status(200).json({status: 200, statusText: "Success"});
            }
        }
    });
}

function getProposalMessages(req,res){
    Proposal.find({
        _id: req.params.id,
        isDeleted: false,
        $or:[{
            createdBy: req.session.passport.user.id
        },{
            invitedUsers:{$in:[req.session.passport.user.id]}
        },{
            farmOwner: req.session.passport.user.id
        }]
    }).exec(function(err, proposal){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            if(proposal){
                ProposalMsg.find({
                    proposal: req.params.id,
                    isDeleted: false
                }).select({
                    message: true,
                    createdDate: true,
                    createdBy: true
                }).populate({
                    path: 'createdBy',
                    model: 'users',
                    select: 'firstName lastName -_id'
                }).sort('createdDate').exec(function(err, messages) {
                    if (err) {
                        return res.status(500).json({status: 500, statusText: err.message});
                    } else {
                        return res.status(200).json({status: 200, statusText: "Success", data:messages});
                    }
                });
            } else {
                return res.status(404).json({status: 404, statusText: "Not found"});
            }
        }
    });
}

function addNewProposalMessage(req,res){
    Proposal.find({
        _id: req.params.id,
        isDeleted: false,
        $or:[{
            createdBy: req.session.passport.user.id
        },{
            invitedUsers:{$in:[req.session.passport.user.id]}
        },{
            farmOwner: req.session.passport.user.id
        }]
    }).exec(function(err, proposal){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            if(proposal){
                var proposalMsgModel = new ProposalMsg();
                proposalMsgModel.proposal = req.params.id;
                proposalMsgModel.message = req.body.message;
                proposalMsgModel.createdBy = req.session.passport.user.id;
                proposalMsgModel.isDeleted = false;
                var date = new Date();
                proposalMsgModel.createdDate = date;
                proposalMsgModel.updatedDate = date;
                proposalMsgModel.save(function(err) {
                    if (err) {
                        return res.status(500).json({status: 500, statusText: err.message});
                    } else {
                        return res.status(200).json({status: 200, statusText: "Success"});
                    }
                });
            } else {
                return res.status(404).json({status: 404, statusText: "Not found"});
            }
        }
    });
}

exports.createProposal = createProposal;
exports.updateProposal = updateProposal;
exports.deleteProposal = deleteProposal;
exports.getProposals = getProposals;
exports.getProposalById = getProposalById;
exports.takeProposalAction = takeProposalAction;
exports.getProposalMessages = getProposalMessages;
exports.addNewProposalMessage = addNewProposalMessage;
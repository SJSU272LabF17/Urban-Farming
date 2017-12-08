var Proposal = require('../models/proposal');

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
                proposalModel.invitedUsers = req.body.invitedUsers;
                proposalModel.farm = req.body.farm;
                proposalModel.createdBy = req.session.passport.user.id;
                if(req.body.asDraft){
                    proposalModel.status = 'DRAFT';
                } else {
                    proposalModel.status = 'SUBMITTED';
                }
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
    return res.status(200).json({status:200,statusText:"Success"});
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
            match: { owner: req.session.passport.user.id },
        }).populate({
            path: 'invitedUsers',
            model: 'users',
            select: 'firstName lastName -_id'
        }).populate({
            path: 'createdBy',
            model: 'users',
            select: 'firstName lastName -_id'
        }).exec(function (err, proposals) {
            proposals = proposals.filter(function(proposal){
                return proposal.farm;
            });
            if (err) {
                return res.status(500).json({status: 500, statusText: err.message});
            } else {
                return res.status(200).json({status: 200, statusText: "Success", data: proposals});
            }
        });
    }
}

function getProposalById(req,res){
    return res.status(200).json({status:200,statusText:"Success"});
}

function takeProposalAction(req,res){
    return res.status(200).json({status:200,statusText:"Success"});
}

function getProposalMessages(req,res){
    return res.status(200).json({status:200,statusText:"Success"});
}

function addNewProposalMessage(req,res){
    return res.status(200).json({status:200,statusText:"Success"});
}

exports.createProposal = createProposal;
exports.updateProposal = updateProposal;
exports.deleteProposal = deleteProposal;
exports.getProposals = getProposals;
exports.getProposalById = getProposalById;
exports.takeProposalAction = takeProposalAction;
exports.getProposalMessages = getProposalMessages;
exports.addNewProposalMessage = addNewProposalMessage;
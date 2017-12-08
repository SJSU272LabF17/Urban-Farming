var ForumTopic = require('../models/forumTopic');
var ForumMsg = require('../models/forumMsg');

function createForumTopic(req,res){
    var forumModel = new ForumTopic();
    forumModel.title = req.body.title;
    forumModel.createdBy = req.session.passport.user.id;
    forumModel.isDeleted = false;
    var date = new Date();
    forumModel.createdDate = date;
    forumModel.updatedDate = date;
    forumModel.save(function(err, forum) {
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success", data: {_id: forum._id}});
        }
    });
}

function getAllForumTopics(req,res){
    ForumTopic.find({
        isDeleted: false
    }).select({
        title: true,
        createdDate: true,
        createdBy: true
    }).populate({
        path: 'createdBy',
        model: 'users',
        select: 'firstName lastName -_id'
    }).sort('-createdDate').exec(function(err, topics) {
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success", data:topics});
        }
    });
}

function addForumComment(req,res){
    var forumMsgModel = new ForumMsg();
    forumMsgModel.message = req.body.message;
    forumMsgModel.topic = req.params.id;
    forumMsgModel.createdBy = req.session.passport.user.id;
    forumMsgModel.isDeleted = false;
    var date = new Date();
    forumMsgModel.createdDate = date;
    forumMsgModel.updatedDate = date;
    forumMsgModel.save(function(err) {
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success"});
        }
    });
}

function getForumComments(req,res){
    ForumMsg.find({
        topic: req.params.id,
        isDeleted: false
    }).select({
        message: true,
        createdDate: true,
        createdBy: true
    }).populate({
        path: 'createdBy',
        model: 'users',
        select: 'firstName lastName -_id'
    }).sort('-createdDate').exec(function(err, messages) {
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success", data:messages});
        }
    });
}

exports.createForumTopic = createForumTopic;
exports.getAllForumTopics = getAllForumTopics;
exports.addForumComment = addForumComment;
exports.getForumComments = getForumComments;
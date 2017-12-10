var Feed = require('../models/feed');

var s3 = require('./s3');

function addNewFeed(req, res){
    var feedModel = new Feed();
    feedModel.content = req.body.content === 'null' ? null:req.body.content;
    feedModel.contactViaPhone = req.body.contactViaPhone === 'true';
    feedModel.contactViaEmail = req.body.contactViaEmail === 'true';
    feedModel.createdBy = req.session.passport.user.id;
    feedModel.photos = [];
    feedModel.isDeleted = false;
    var date = new Date();
    feedModel.createdDate = date;
    feedModel.updatedDate = date;
    console.log(req.files);
    if(req.files === null) {
        feedModel.save(function (err) {
            if (err) {
                return res.status(500).json({status: 500, statusText: err.message});
            } else {
                return res.status(200).json({status: 200, statusText: "Success"});
            }
        });
    } else {
        s3.upload(req.files, function(err, result) {
            if(err) {
                return res.status(500).json({status: 500, statusText: "Failed to upload images to S3 storage"});
            } else {
                feedModel.photos = result;
                feedModel.save(function (err) {
                    if (err) {
                        return res.status(500).json({status: 500, statusText: err.message});
                    } else {
                        return res.status(200).json({status: 200, statusText: "Success"});
                    }
                });
            }
        });
    }
}

function updateFeed(req, res){
    var updateObj = {
        content : req.body.content === 'null' ? null:req.body.content,
        contactViaEmail : req.body.contactViaEmail === 'true',
        contactViaPhone : req.body.contactViaPhone === 'true',
        photos:req.body.photos.length > 0 ? req.body.photos.split(',').length:[],
        updatedDate : new Date()
    }
    console.log(req);
    if(req.files === null) {
        Feed.update({
            _id: req.params.id,
            createdBy: req.session.passport.user.id
        }, updateObj, function(err, result){
            if (err) {
                return res.status(500).json({status: 500, statusText: err.message});
            } else {
                return res.status(200).json({status: 200, statusText: "Success"});
            }
        });
    } else {
        s3.upload(req.files, function(err, result) {
            if(err) {
                return res.status(500).json({status: 500, statusText: "Failed to upload images to S3 storage"});
            } else {
                updateObj.photos.push.apply(updateObj.photos,result);
                Feed.update({
                    _id: req.params.id,
                    createdBy: req.session.passport.user.id
                }, updateObj, function(err, result){
                    if (err) {
                        return res.status(500).json({status: 500, statusText: err.message});
                    } else {
                        return res.status(200).json({status: 200, statusText: "Success"});
                    }
                });
            }
        });
    }
}

function deleteFeed(req, res){
    Feed.update({
        _id: req.params.id,
        createdBy: req.session.passport.user.id
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

function getMyFeeds(req, res){
    Feed.find({
        createdBy:req.session.passport.user.id,
        isDeleted:false
    }).exec(function(err, feeds){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success", data: feeds});
        }
    });
}

function searchFeeds(req, res){
    Feed.find({
        isDeleted:false
    }).select({
        isDeleted: false
    }).populate('createdBy','firstName lastName phoneNumber email _id').lean().exec(function(err, feeds){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            // feeds.forEach(function(feed, index, newFeeds) {
            //     if(!newFeeds[index].contactViaEmail){
            //         delete newFeeds[index].createdBy.email;
            //     }
            //     if(!newFeeds[index].contactViaPhone){
            //         delete newFeeds[index].createdBy.phoneNumber;
            //     }
            // });
            return res.status(200).json({status: 200, statusText: "Success", data: feeds});
        }
    });
}

exports.addNewFeed = addNewFeed;
exports.updateFeed = updateFeed;
exports.getMyFeeds = getMyFeeds;
exports.deleteFeed = deleteFeed;
exports.searchFeeds = searchFeeds;
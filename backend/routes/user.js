var ObjectId = require('mongodb').ObjectId;

var mongo = require('./mongo');

function getUserProfile(req,res){
	mongo.getCollection('user', function(err,coll){
        coll.findOne({_id:new ObjectId(req.user._id)}, function(err,user){
            if(err) {
                return res.status(500).json({status:500,statusText:"Internal server error"});
            } else {
                if (user) {
                    var payload = {
                        first_name:user.first_name,
                        last_name:user.last_name,
                        email:user.email
                    };
                    return res.status(200).json({status:200,statusText:"Success",data:payload});
                } else {
                    return res.status(404).json({status:404,statusText:"User not found"});
                }  
            }     
        });
    })
}

function updateUserProfile(req,res){
	if(req.body.first_name && req.body.first_name !== ''
        && req.body.last_name && req.body.last_name !== '') {
        mongo.getCollection('user', function(err,coll){
            coll.updateOne(
            {
                _id:new ObjectId(req.user._id)
            },
            {
                $set: {
                    first_name:req.body.first_name,
                    last_name:req.body.last_name
                }
            }, function(err,result){
                if(err) {
                    return res.status(500).json({status:500,statusText:"Internal server error"});
                } else {
                    return res.status(200).json({status:200,statusText:"Success"});
                }
            });
        })
    } else {
        return res.status(400).json({status:400,statusText:"Fields missing"});
    }
}

exports.getUserProfile = getUserProfile;
exports.updateUserProfile = updateUserProfile;
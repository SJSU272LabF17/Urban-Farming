var User = require('../models/user');

function getProfile(req,res){
    User.findById(req.session.passport.user.id,{
        _id:false,
        password:false,
        isDeleted:false,
        isVerified:false,
        role:false,
        createdDate:false,
        updatedDate:false
    }, function(err, user){
        if(err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success",data:user});
        }
    });
}

function updateProfile(req,res){
    var updateObj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        streetAddress : req.body.streetAddress,
        city : req.body.city,
        state : req.body.state,
        zipCode : req.body.zipCode,
        phoneNumber : req.body.phoneNumber,
        ssn: req.body.ssn,
        occupation: req.body.occupation,
        education: req.body.education,
        pastExperience: req.body.pastExperience,
        dateOfBirth: req.body.dateOfBirth,
        updatedDate : new Date()
    }
    User.update({
        _id: req.session.passport.user.id
    }, updateObj, function(err, result){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success"});
        }
    });
}

function searchFarmers(req,res){
    User.find({
        isDeleted:false,
        role:"FARMER",
        _id:{$ne:req.session.passport.user.id},
        $or:[{
            firstName:new RegExp('.*'+req.query.q+'.*','gi'),
        },{
            lastName:new RegExp('.*'+req.query.q+'.*','gi'),
        },{
            email:new RegExp('.*'+req.query.q+'.*','gi'),
        }]
    }).select({
        _id:true,
        firstName:true,
        lastName:true,
        email:true
    }).exec(function(err, farmers){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success", data: farmers});
        }
    });
}

exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.searchFarmers = searchFarmers;
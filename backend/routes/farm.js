var Farm = require('../models/farm');

function addNewFarm(req, res){
    var farmModel = new Farm();
    farmModel.streetAddress = req.body.streetAddress;
    farmModel.city = req.body.city;
    farmModel.state = req.body.state;
    farmModel.zipCode = req.body.zipCode;
    farmModel.location = [ req.body.lng, req.body.lat ];
    farmModel.size = req.body.size;
    farmModel.waterConn = req.body.waterConn;
    farmModel.waterAlternative = req.body.waterAlternative;
    farmModel.appliedWaterConn = req.body.appliedWaterConn;
    farmModel.existingStructures = req.body.existingStructures;
    farmModel.isDeleted = false;
    farmModel.owner = req.session.passport.user.id;
    farmModel.status = 'ACTVIE';
    var date = new Date();
    farmModel.createdDate = date;
    farmModel.updatedDate = date;
    farmModel.save(function(err) {
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success"});
        }
    });
}

function updateFarm(req, res){
    var updateObj = {
        streetAddress : req.body.streetAddress,
        city : req.body.city,
        state : req.body.state,
        zipCode : req.body.zipCode,
        location : [req.body.lng, req.body.lat],
        size : req.body.size,
        waterConn : req.body.waterConn,
        waterAlternative : req.body.waterAlternative,
        appliedWaterConn : req.body.appliedWaterConn,
        existingStructures : req.body.existingStructures,
        updatedDate : new Date()
    }
    Farm.update({
        _id: req.params.id,
        owner: req.session.passport.user.id
    }, updateObj, function(err, result){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success"});
        }
    });
}

function getMyFarms(req, res){
    Farm.find({
        owner:req.session.passport.user.id,
        isDeleted:false
    }).exec(function(err, farms){
        if (err) {
            return res.status(500).json({status: 500, statusText: err.message});
        } else {
            return res.status(200).json({status: 200, statusText: "Success", data: farms});
        }
    });
}

function deleteFarm(req, res){
    Farm.update({
        _id: req.params.id,
        owner: req.session.passport.user.id
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

function searchFarms(req, res){
    if(req.query.lat && !isNaN(parseFloat(req.query.lat))
        && req.query.lng && !isNaN(parseFloat(req.query.lng))) {
        var coords = [parseFloat(req.query.lng),parseFloat(req.query.lat)];
        Farm.find({
            location: {
                $near: coords,
                $maxDistance: 100/6371 //in radians
            },
            status:"ACTIVE",
            isDeleted:false
        }).exec(function(err, farms){
            if (err) {
                return res.status(500).json({status: 500, statusText: err.message});
            } else {
                return res.status(200).json({status: 200, statusText: "Success", data: farms});
            }
        });
    } else {
        return res.status(400).json({status: 400, statusText: "Bad request"});
    }
}

exports.addNewFarm = addNewFarm;
exports.updateFarm = updateFarm;
exports.getMyFarms = getMyFarms;
exports.deleteFarm = deleteFarm;
exports.searchFarms = searchFarms;

function getProfile(req,res){
    return res.status(200).json({status:200,statusText:"Success"});
}

function updateProfile(req,res){
    return res.status(200).json({status:200,statusText:"Success"});
}

function searchFarmers(req,res){
    return res.status(200).json({status:200,statusText:"Success"});
}

exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.searchFarmers = searchFarmers;
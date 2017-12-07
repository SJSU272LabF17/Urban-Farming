
function createForumTopic(req,res){
    return res.status(200).json({status:200,statusText:"Success"});
}

function getAllForumTopics(req,res){
    return res.status(200).json({status:200,statusText:"Success"});
}

function addForumComment(req,res){
    return res.status(200).json({status:200,statusText:"Success"});
}

function getForumComments(req,res){
    return res.status(200).json({status:200,statusText:"Success"});
}

exports.createForumTopic = createForumTopic;
exports.getAllForumTopics = getAllForumTopics;
exports.addForumComment = addForumComment;
exports.getForumComments = getForumComments;
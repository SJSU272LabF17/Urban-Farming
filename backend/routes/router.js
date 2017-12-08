
module.exports = function(router,passport) {

	var auth = require('./auth')(passport);
    var farm = require('./farm');
    var user = require('./user');
    var proposal = require('./proposal');
    var forum = require('./forum');

	router.post('/signin', auth.signin);
	router.post('/signup', auth.signup);
	router.post('/logout', auth.logout);
	router.get('/check_session', isAuthenticated, auth.checkSession);

	router.post('/farms', isOwnerAuthenticated, farm.addNewFarm);
    router.put('/farms/:id', isOwnerAuthenticated, farm.updateFarm);
    router.delete('/farms/:id', isOwnerAuthenticated, farm.deleteFarm);
    router.get('/myfarms', isOwnerAuthenticated, farm.getMyFarms);
    router.get('/farms', farm.searchFarms);

    router.get('/profile', isAuthenticated, user.getProfile);
    router.put('/profile', isAuthenticated, user.updateProfile);
    router.get('/farmers', isFarmerAuthenticated, user.searchFarmers);

    router.post('/proposals', isFarmerAuthenticated, proposal.createProposal);
    //TODO update proposal with draft/submitted status
    router.put('/proposals/:id', isFarmerAuthenticated, proposal.updateProposal);
    router.delete('/proposals/:id', isFarmerAuthenticated, proposal.deleteProposal);
    router.get('/proposals', isAuthenticated, proposal.getProposals);
    router.get('/proposals/:id', isAuthenticated, proposal.getProposalById);
    //TODO accept-reject proposal, its own farm proposal only
    router.post('/proposals/action', isOwnerAuthenticated, proposal.takeProposalAction);

    //TODO get all messages for proposal, shouldn't allow outside party
    router.get('/proposals/:id/messages', isAuthenticated, proposal.getProposalMessages);
    //TODO add new message to proposal, shouldn't allow outside party
    router.post('/proposals/:id/messages', isAuthenticated, proposal.addNewProposalMessage);

    //TODO create forum topic
    router.post('/forums', isAuthenticated, forum.createForumTopic);
    //TODO get all forum topics
    router.get('/forums', forum.getAllForumTopics);
    //TODO add comment to forum
    router.post('/forums/:id/comments', isAuthenticated, forum.addForumComment);
    //TODO add comment to forum
    router.get('/forums/:id/comments', forum.getForumComments);

	function isAuthenticated(req, res, next) {
	    if(req.session.passport && req.session.passport.user.id) {
			next();
	  	} else {
			res.status(403).send();
		}
	}

    function isOwnerAuthenticated(req, res, next) {
        if(req.session.passport && req.session.passport.user.id && req.session.passport.user.role === 'OWNER') {
            next();
        } else {
            res.status(403).send();
        }
    }

    function isFarmerAuthenticated(req, res, next) {
        if(req.session.passport && req.session.passport.user.id && req.session.passport.user.role === 'FARMER') {
            next();
        } else {
            res.status(403).send();
        }
    }

}
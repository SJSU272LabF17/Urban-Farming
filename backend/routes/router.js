
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

    //get self profile
    router.get('/profile', isAuthenticated, user.getProfile);
    //update self profile
    router.put('/profile', isAuthenticated, user.updateProfile);
    //search farmers to invite in proposal
    router.get('/farmers', isFarmerAuthenticated, user.searchFarmers);

    //create proposal with draft/submitted status - should not allow duplicate proposals to same farm even if invited to other proposal
    router.post('/proposals', isFarmerAuthenticated, proposal.createProposal);
    //update proposal with draft/submitted status
    router.put('/proposals/:id', isFarmerAuthenticated, proposal.updateProposal);
    //delete proposal if still in draft only
    router.delete('/proposals/:id', isFarmerAuthenticated, proposal.deleteProposal);
    //get all proposals by category - own/invitedTo for farmer - own farm's proposals for owner
    router.get('/proposals', isAuthenticated, proposal.getProposals);
    //get proposal data by id based on role
    router.get('/proposals/:id', isAuthenticated, proposal.getProposalById);
    //accept-reject proposal, its own farm proposal only
    router.post('/proposals/action', isOwnerAuthenticated, proposal.takeProposalAction);

    //get all messages for proposal, shouldn't allow outside party
    router.get('/proposals/messages/:id', isAuthenticated, proposal.getProposalMessages);
    //add new message to proposal, shouldn't allow outside party
    router.post('/proposals/messages', isAuthenticated, proposal.addNewProposalMessage);

    //create forum topic
    router.post('/forums', isAuthenticated, forum.createForumTopic);
    //get all forum topics
    router.get('/forums', forum.getAllForumTopics);
    //add comment to forum
    router.post('/forums/:id/comments', isAuthenticated, forum.addForumComment);
    //add comment to forum
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
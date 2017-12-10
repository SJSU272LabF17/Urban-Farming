
module.exports = function(router,passport) {

	var auth = require('./auth')(passport);
    var farm = require('./farm');
    var feed = require('./feed');
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
    router.post('/adminfarms', isAdminAuthenticated, farm.addNewAdminFarm);
    router.get('/adminfarms', isAdminAuthenticated, farm.getAdminFarms);
    router.put('/adminfarms/:id', isAdminAuthenticated, farm.updateAdminFarm);
    router.delete('/adminfarms/:id', isAdminAuthenticated, farm.deleteAdminFarm);

    router.post('/feeds', isFarmerAuthenticated, feed.addNewFeed);
    router.put('/feeds/:id', isFarmerAuthenticated, feed.updateFeed);
    router.delete('/feeds/:id', isFarmerAuthenticated, feed.deleteFeed);
    router.get('/myfeeds', isFarmerAuthenticated, feed.getMyFeeds);
    router.get('/feeds', feed.searchFeeds);

    router.get('/profile', isAuthenticated, user.getProfile);
    router.put('/profile', isAuthenticated, user.updateProfile);
    router.get('/farmers', isFarmerAuthenticated, user.searchFarmers);

    router.post('/proposals', isFarmerAuthenticated, proposal.createProposal);
    router.put('/proposals/:id', isFarmerAuthenticated, proposal.updateProposal);
    router.delete('/proposals/:id', isFarmerAuthenticated, proposal.deleteProposal);
    router.get('/proposals', isAuthenticated, proposal.getProposals);
    router.get('/proposals/:id', isAuthenticated, proposal.getProposalById);
    router.post('/proposals/:id/action', isOwnerAuthenticated, proposal.takeProposalAction);

    router.get('/proposals/:id/messages', isAuthenticated, proposal.getProposalMessages);
    router.post('/proposals/:id/messages', isAuthenticated, proposal.addNewProposalMessage);

    router.post('/forums', isAuthenticated, forum.createForumTopic);
    router.get('/forums', forum.getAllForumTopics);
    router.post('/forums/:id/messages', isAuthenticated, forum.addForumComment);
    router.get('/forums/:id/messages', forum.getForumComments);

	function isAuthenticated(req, res, next) {
	    if(req.session.passport && req.session.passport.user.id) {
			next();
	  	} else {
			res.status(403).send();
		}
	}

    function isAdminAuthenticated(req, res, next) {
        if(req.session.passport && req.session.passport.user.id && req.session.passport.user.role === 'ADMIN') {
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

module.exports = function(router,passport) {

	var auth = require('./auth')(passport);
    var farm = require('./farm');

	router.post('/signin', auth.signin);
	router.post('/signup', auth.signup);
	router.post('/logout', auth.logout);
	router.get('/check_session', isAuthenticated, auth.checkSession);

	router.post('/farms', isOwnerAuthenticated, farm.addNewFarm);
    router.put('/farms/:id', isOwnerAuthenticated, farm.updateFarm);
    router.delete('/farms/:id', isOwnerAuthenticated, farm.deleteFarm);
    router.get('/myfarms', isOwnerAuthenticated, farm.getMyFarms);
    router.get('/farms', farm.searchFarms);
	
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
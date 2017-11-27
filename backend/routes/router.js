
module.exports = function(router,passport) {

	var auth = require('./auth')(passport);
    var user = require('./user');

	router.post('/signin', auth.signin);
	router.post('/signup', auth.signup);
	router.post('/logout', auth.logout);
	router.get('/check_session', isAuthenticated, auth.checkSession);

	router.get('/user_profile', user.getUserProfile)
	
	function isAuthenticated(req, res, next) {
		if(req.session.passport && req.session.passport.user._id) {
			next();
	  	} else {
			res.status(401).send();
		}
	}

}
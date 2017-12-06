
module.exports = function(passport) {
	var module = {};

	module.signin = function(req,res){
		passport.authenticate('local-signin', function(err,result) {
	        if(err) {
	            return res.status(500).json({status:500,statusText:"Internal server error"});
	        }
	        if(result.code === 200) {
	        	req.session.passport = {user: result.data};
	        }
	        return res.status(result.code).json({status:result.code,statusText:result.message});
	    })(req, res);
	}

	module.signup = function(req,res){
		passport.authenticate('local-signup', function(err,result) {
            if(err) {
	            return res.status(500).json({status:500,statusText:"Internal server error"});
	        }
	        if(result.code === 200) {
	        	req.session.passport = {user: result.data};
	        }
	        return res.status(result.code).json({status:result.code,statusText:result.message});
	    })(req, res);
	}

	module.checkSession = function(req,res){
		res.status(200).json({status:200,statusText:"Success",data:{uname:req.user.uname,role:req.user.role}});
	}

	module.logout = function(req,res){
		req.session.destroy();
    	res.status(200).json({status:200,statusText:"Success"});
	}

	return module;
}
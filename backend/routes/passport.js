var LocalStrategy = require("passport-local").Strategy;

var bcrypt = require('bcrypt');
const saltRounds = 10;

var mongo = require('./mongo');

module.exports = function(passport) {
    //normal signin
    passport.use('local-signin', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
    }, function(username,password,done) {
        process.nextTick(function() {
            try {
                var res = {};
                if(username && username !== '' 
                    && password && password !== '') {
                    mongo.getCollection('user', function(err,coll){
                        coll.findOne({email:username}, function(err,user){
                            if(err) {
                                res.code = 500;
                                res.message = "Internal server error";
                                done(null, res);
                            } else {
                                if (user) {
                                    bcrypt.compare(password, user.password, function(err,result) {
                                        if(result) {
                                            res.code = 200;
                                            res.message = "Success";
                                            res.data = {_id:user._id,uname:user.firstName+" "+user.lastName,role:user.role};
                                        } else {
                                            res.code = 401;
                                            res.message = "Invalid password";
                                        }
                                        done(null, res);
                                    });
                                } else {
                                    res.code = 401;
                                    res.message = "Invalid email";
                                    done(null, res);
                                }  
                            }     
                        });
                    })
                } else {
                    res.code = 400;
                    res.message = "Fields missing";
                    done(null, res);
                }
            } catch (e) {
                done(e);
            }
        });
    }));

    //normal signup
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    }, function(req,username,password,done) {
        process.nextTick(function() {
            try {
                var res = {};
                if(req.body.email && req.body.email !== '' 
                    && req.body.password && req.body.password !== ''
                    && req.body.firstName && req.body.firstName !== ''
                    && req.body.lastName && req.body.lastName !== ''
                    && req.body.role && req.body.role !== '') {
                    mongo.getCollection('user', function(err,coll){
                        coll.findOne({email:req.body.email}, function(err,user){
                            if(err) {
                                res.code = 500;
                                res.message = "Internal server error";
                                done(null, res);
                            } else {
                                if (user) {
                                    res.code = 400;
                                    res.message = "User already exists";
                                    done(null, res);
                                } else {
                                    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                                        coll.insert({
                                            firstName:req.body.firstName,
                                            lastName:req.body.lastName,
                                            email:req.body.email,
                                            password:hash,
                                            role:req.body.role,
                                            isVerified:true
                                        },function(err, user){
                                            if (err) {
                                                res.code = 500;
                                                res.message = "Internal server error";
                                            } else {
                                                res.code = 200;
                                                res.message = "Success";
                                                res.data = {_id:user.insertedIds[0],uname:req.body.firstName+" "+req.body.lastName,role:req.body.role};
                                            }
                                            done(null, res);
                                        });
                                    });
                                }
                            }
                        });
                    })
                } else {
                    res.code = 400;
                    res.message = "Fields missing";
                    done(null, res);
                }
            } catch (e) {
                done(e);
            }
        });
    }));

    passport.serializeUser(function(user, done){
        done(null, user);
    })

    passport.deserializeUser(function(user, done){
        done(null,user);
    })
};



var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var config = require('config');

var passport = require('passport');

var app = express();

var mongoSessionURL = config.dbUrl;
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var mongo = require('./routes/mongo');

var cors = require('cors');

require('./routes/passport')(passport);

var router = express.Router();
require('./routes/router')(router,passport);

var corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true
}
app.use(cors(corsOptions))

app.set('port', process.env.PORT || 3001);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("CMPE272_urban_farming"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSessions({
    secret: "CMPE272_urban_farming",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 6 * 60 * 60 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1',router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var bcrypt = require('bcrypt');
const saltRounds = 10;

mongo.connect(function(err,res){
    if(err){
        console.log("ERROR: Could not connect to MongoDB");
    } else {
        mongo.getCollection("users", function(err, coll){
            coll.findOne({email:"admin@urbanfarmingnetwork.com"}, function(err, user){
                if(user === null){
                    bcrypt.hash("admin", saltRounds, function(err, hash) {
                        var date = new Date();
                        coll.insert({
                            firstName: "Admin",
                            lastName: "User",
                            email: "admin@urbanfarmingnetwork.com",
                            password: hash,
                            role: "ADMIN",
                            isVerified: true,
                            isDeleted: false,
                            createdDate: date,
                            updatedDate: date
                        }, function (err, res) {
                            http.createServer(app).listen(app.get('port'), function () {
                                console.log('Express server listening on port ' + app.get('port'));
                            })
                        })
                    })
                } else {
                    http.createServer(app).listen(app.get('port'), function(){
                        console.log('Express server listening on port ' + app.get('port'));
                    })
                }
            })
        })
    }
});

module.exports = app;

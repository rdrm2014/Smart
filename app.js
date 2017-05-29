var location = process.cwd() + "/";
var passport = require('passport');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var config = require(location + "config/config");
require(location + 'config/passport')(config, passport); // pass passport for configuration
// connect to the database
mongoose.connect(config.get('mongoose:uri'));
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require(location + 'routes/index');
var users = require(location + 'routes/users');
var peers = require(location + 'routes/peers');
var applications = require(location + 'routes/applications');

var cors = require('cors');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

var app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// view engine setup
app.set('views', location + 'views');
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'cookie monster',
    cookie: {maxAge: 7 * 24 * 3600 * 1000},
    resave: true,
    saveUninitialized: true
}));


console.log("app.use(passport.initialize());");
app.use(passport.initialize());
app.use(passport.session());

//app.use(express.static(location + 'public'));

app.use(cors(corsOptions));

app.use('/', index);
app.use('/users', users);
app.use('/peers', peers);
app.use('/applications', applications);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//*/
module.exports = app;
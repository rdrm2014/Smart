var location = process.cwd() + "/";
var passport = require('passport');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var swagger = require('swagger-express');
var config = require(location + "config/config");
require(location + 'config/passport')(config, passport); // pass passport for configuration
// connect to the database
mongoose.connect(config.get('mongoose:uri'));
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require(location + 'routes/api');
var index = require(location + 'routes/index');
var users = require(location + 'routes/users');
var equipments = require(location + 'routes/equipments');
var installs = require(location + 'routes/installs');
var sensors = require(location + 'routes/sensors');

var cors = require('cors');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

var app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
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

app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    basePath: 'http://localhost:3000',
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public/swagger/',
    apis: ['./routes/api.js'],
    //middleware: function(req, res){}
}));

//app.use(app.router);

//console.log("app.use(passport.initialize());");
app.use(passport.initialize());
app.use(passport.session());

//app.use(express.static(location + 'public'));

app.use(cors(corsOptions));

app.use('/', index);
app.use('/users', users);
app.use('/installs', installs);
app.use('/installs', equipments);
app.use('/installs', sensors);

app.use('/api', api);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// catch 404 and forward to error handler
app.use(function(err, req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.status(err.status || 404);
        res.render('error', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

//*/
module.exports = app;
var src = process.cwd() + "/";
var passport = require('passport');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var swagger = require('swagger-express');
var config = require(src + "config/config");
require(src + 'config/passport')(config, passport); // pass passport for configuration
// connect to the database
mongoose.connect(config.get('mongoose:uri'), {
    useMongoClient: true
});
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require(src + 'routes/api');
var index = require(src + 'routes/index');
var users = require(src + 'routes/users');
var equipments = require(src + 'routes/equipments');
var installs = require(src + 'routes/installs');
var sensors = require(src + 'routes/sensors');

var cors = require('cors');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

var app = express();

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// view engine setup
app.set('views', src + 'views');
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
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
    apis: ['./routes/api.js']
    //middleware: function(req, res){}
}));

app.use(passport.initialize());
app.use(passport.session());

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
app.use(function (err, req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.status(err.status || 404);
        res.render('error', {url: req.url});
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({error: 'Not found'});
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

/**
 * Run Multiple instances
 **/
// or more concisely
var exec = require('child_process').exec;
function execInstances(error, stdout, stderr) {
    console.log(stdout);
}

var locationNode = config.get('nodeRed:path');
var locationNodeSettings = config.get('nodeRed:pathSettings');

var UserModel = require(src + 'models/user');

// installs
UserModel.find().exec(function (err, users) {
    if (err) {
        res.statusCode = 500;
    } else {
        users.forEach(function (user) {
            exec("node " + locationNode + "red.js --settings " + locationNodeSettings + "settings_" + user._id + ".js", execInstances);
        });
    }
});

module.exports = app;
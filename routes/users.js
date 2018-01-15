/**
 * Created by ricardomendes on 10/01/17.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');

var src = process.cwd() + '/';
var config = require(src + "config/config");
var filesCreator = require(src + 'functions/filesCreator');

var UserModel = require(src + 'models/user');
var spawn = require('child_process').spawn;

var jwt = require('jsonwebtoken');

// normal routes ===============================================================
// PROFILE SECTION =========================
router.get('/profile', isLoggedIn, function (req, res) {
    res.render('users/profile', {
        user: req.user, title: 'Smart-*'
    });
});

// LOGOUT ==============================
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

// locally --------------------------------
// LOGIN ===============================
// show the login form
router.get('/login', function (req, res) {
    var callback = req.query["callback"];
    res.render('login', {callback: callback, message: req.flash('message'), title: 'Smart-*'});
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
            failureRedirect: '/users/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }
    ), function (req, res) {
        if (req.body["callback"]) {
            res.status(200).json({success: true, token: 'JWT ' + token});
        } else {
            res.redirect("/home");
        }
    }
);

// Authenticate the user and get a JSON Web Token to include in the header of future requests.
router.post('/authenticate', passport.authenticate('local-login', {}),
    function (req, res) {
        const token = jwt.sign(req.user, config.get('default:api:secretOrKey'), {
            expiresIn: 10080 // in seconds
        });
        res.status(200).json({success: true, token: 'JWT ' + token});
    });


// SIGNUP =================================
// show the signup form
router.get('/signup', function (req, res) {
    res.render('signup',{title: 'Smart-*'});
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/users/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

// facebook -------------------------------
// send to facebook to do the authentication
router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/home',
        failureRedirect: '/'
    }));

// twitter --------------------------------
// send to twitter to do the authentication
router.get('/auth/twitter', passport.authenticate('twitter', {scope: 'email'}));

// handle the callback after twitter has authenticated the user
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/home',
        failureRedirect: '/'
    }));

// google ---------------------------------
// send to google to do the authentication
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/home',
        failureRedirect: '/'
    }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================
// locally --------------------------------
router.get('/connect/local', function (req, res) {
    res.render('connect-local');
    //res.render('connect-local', {message: req.flash('loginMessage')});
});
router.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/users/connect/local', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

// facebook -------------------------------
// send to facebook to do the authentication
router.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));

// handle the callback after facebook has authorized the user
router.get('/connect/facebook/callback',
    passport.authorize('facebook', {
        successRedirect: '/home',
        failureRedirect: '/'
    }));

// twitter --------------------------------
// send to twitter to do the authentication
router.get('/connect/twitter', passport.authorize('twitter', {scope: 'email'}));

// handle the callback after twitter has authorized the user
router.get('/connect/twitter/callback',
    passport.authorize('twitter', {
        successRedirect: '/home',
        failureRedirect: '/'
    }));

// google ---------------------------------
// send to google to do the authentication
router.get('/connect/google', passport.authorize('google', {scope: ['profile', 'email']}));

// the callback after google has authorized the user
router.get('/connect/google/callback',
    passport.authorize('google', {
        successRedirect: '/home',
        failureRedirect: '/'
    }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future
// local -----------------------------------
router.get('/unlink/local', function (req, res) {
    var user = req.user;
    user.local.username = undefined;
    user.local.password = undefined;
    user.save(function (err) {
        res.redirect('/home');
    });
});

// facebook -------------------------------
router.get('/unlink/facebook', function (req, res) {
    var user = req.user;
    user.facebook.id = undefined;
    user.facebook.token = undefined;
    user.facebook.email = undefined;
    user.facebook.name = undefined;
    user.save(function (err) {
        res.redirect('/home');
    });
});

// twitter --------------------------------
router.get('/unlink/twitter', function (req, res) {
    var user = req.user;
    user.twitter.id = undefined;
    user.twitter.token = undefined;
    user.twitter.displayName = undefined;
    user.twitter.username = undefined;
    user.save(function (err) {
        res.redirect('/home');
    });
});

// google ---------------------------------
router.get('/unlink/google', function (req, res) {
    var user = req.user;
    user.google.id = undefined;
    user.google.token = undefined;
    user.google.email = undefined;
    user.google.name = undefined;
    user.save(function (err) {
        res.redirect('/home');
    });
});

// urlNodeRed ---------------------------------
router.get('/urlnodered', isLoggedIn, function (req, res) {
    res.render('users/changeUI', {user: req.user});
});

router.post('/urlnodered/create', isLoggedIn, function (req, res) {
    var paramObj = {
        urlNodeRed: req.body['urlnodered']
    };

    /*
     //Create settings node-red for user and run instance
     */
    UserModel.update(req.user, paramObj, function (err) {
        if (err) {
            console.log(err);
            return res.redirect('/users/urlnodered');
        }
        res.redirect('/users/profile');
    });
});

router.get('/unlink/nodered', function (req, res) {
    var user = req.user;
    user.urlNodeRed = undefined;
    user.save(function (err) {
        res.redirect('/home');
    });
});

// updateFlow---------------------------------
router.post('/updateFlow', isLoggedIn, function (req, res) {
    // Update Flow
    var locationSettingsFile = config.get('nodeRed:pathSettings') + "settings_" + req.user._id + ".js";
    var locationFlowFile = config.get('nodeRed:pathFlows') + "flow_" + req.user._id + ".json";

    console.log("locationSettingsFile: " + locationSettingsFile);
    console.log("locationFlowFile: " + locationFlowFile);

    filesCreator.settingsCreator(req.user, src + "templates/nodeRed_settings_template.js", {
        uiPort: 1885,
        idUser: req.user._id,
        userDir: config.get('nodeRed:pathNodeRed')
    }, locationSettingsFile);

    filesCreator.jsonCreator(req.user, locationFlowFile, function (err, err1) {
        if (err || err1) {
            console.log("ERRORR: " + err + "\n" + err1);
        }
    });
    // Restart process NodeRed
    /**
     * Run Multiple instances
     **/
    if (req.user.pid) {
        // PID exist?
        //var psCommand = spawn("sh", ["shellScripts/killAllProcessNodeRed.sh"]);
        var psCommand = spawn("sh", ["shellScripts/killProcess.sh", req.user.pid]);
        psCommand.stdout.on("data", function (data) {
            console.log(data.toString());
        });
    }
    var locationNode = config.get('nodeRed:path');
    var locationNodeSettings = config.get('nodeRed:pathSettings');
    var command = spawn("node", [locationNode + "red.js", "--settings ", locationNodeSettings + "settings_" + req.user._id + ".js"]);
    var paramObj = {
        pid: command.pid,
        updateFlowDate: Date.now()
    };
    UserModel.update(req.user, paramObj, function (err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("TESTE5");
    res.redirect('/users/profile');
});

module.exports = router;

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
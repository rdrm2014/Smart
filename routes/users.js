/**
 * Created by ricardomendes on 10/01/17.
 */
var express = require('express');
var router = express.Router();

var passport = require('passport');

var jwt = require('jsonwebtoken');

// normal routes ===============================================================
// PROFILE SECTION =========================
router.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile', {
        user: req.user
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
    //res.render('login', {message: req.flash('loginMessage')});
    var callbackLink = req.query["callbackLink"];
    res.render('login', {callbackLink: callbackLink});
    //res.render('login', {callbackLink: req.param["callbackLink"]});
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
 //successRedirect: '/home', // redirect to the secure profile section
 failureRedirect: '/users/login', // redirect back to the signup page if there is an error
 failureFlash: true // allow flash messages
 }
), function(req,res){
        if(req.body["callbackLink"]){
            res.redirect(req.body["callbackLink"]);
        } else{
            res.redirect("/home");
        }
}
);
/*router.post('/login', /*function (req, res) {
     //res.render('login', {message: req.flash('loginMessage')});
     var name = req.body.username;
     var password = req.body.password;
     console.log(name + ": " + password);
     });*/

/*   passport.authenticate('jwt', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/users/login', // redirect back to the signup page if there is an error
        failureFlash: false,// allow flash messages
        session: false
    }));
*/







// SIGNUP =================================
// show the signup form
router.get('/signup', function (req, res) {
    //res.render('signup', {message: req.flash('loginMessage')});
    res.render('signup');
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
        res.redirect('/users/home');
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
        res.redirect('/users/home');
    });
});

module.exports = router;

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
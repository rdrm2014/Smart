/**
 * Created by ricardomendes on 10/01/17.
 */
var src = process.cwd() + '/';
var config = require(src + "config/config");

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require(src + 'models/user');

module.exports = function (config, passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'username',
            passwordField: 'password',
            session: false,
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, username, password, done) {
            /**
             * Add Instance of node-red
             */
                // asynchronous
            process.nextTick(function () {
                User.findOne({'local.username': username}, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                    //return done(null, false, req.flash('loginMessage', 'No user found.'));
                        return done(null, false);

                    if (!user.validPassword(password))
                    //return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                        return done(null, false);

                    // all is well, return user
                    else
                        return done(null, user);
                });
            });
        }));


    // =========================================================================
    // JWT LOGIN =============================================================
    // =========================================================================

    passport.use('jwt', new JwtStrategy({
            //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
            session: false,
            secretOrKey: config.get('default:api:secretOrKey')
        },
        function(jwt_payload, done) {
            User.findOne({id: jwt_payload.id}, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        }));


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, username, password, done) {

            // asynchronous
            process.nextTick(function () {

                //  Whether we're signing up or connecting an account, we'll need
                //  to know if the username address is in use.
                User.findOne({'local.username': username}, function (err, existingUser) {

                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if there's already a user with that username
                    if (existingUser)
                    //return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                        return done(null, false);

                    //  If we're logged in, we're connecting a new local account.
                    if (req.user) {
                        var user = req.user;
                        user.local.username = username;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        });

                    }
                    //  We're not logged in, so we're creating a brand new user.
                    else {
                        // create the user
                        var newUser = new User();

                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

            clientID: config.get('configAuth:facebookAuth:clientID'),
            clientSecret: config.get('configAuth:facebookAuth:clientSecret'),
            callbackURL: config.get('configAuth:facebookAuth:callbackURL'),
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function (req, token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {

                    User.findOne({'facebook.id': profile.id}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.facebook.token) {
                                user.facebook.token = token;
                                user.facebook.name = profile.displayName;

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = token;
                            newUser.facebook.name = profile.displayName;
                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.facebook.id = profile.id;
                    user.facebook.token = token;
                    user.facebook.name = profile.displayName;

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });

                }
            });

        }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

            consumerKey: config.get('configAuth:twitterAuth:consumerKey'),
            consumerSecret: config.get('configAuth:twitterAuth:consumerSecret'),
            callbackURL: config.get('configAuth:twitterAuth:callbackURL'),
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function (req, token, tokenSecret, profile, done) {

            // asynchronous
            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {

                    User.findOne({'twitter.id': profile.id}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.twitter.token) {
                                user.twitter.token = token;
                                user.twitter.username = profile.username;
                                user.twitter.displayName = profile.displayName;

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            newUser.twitter.id = profile.id;
                            newUser.twitter.token = token;
                            newUser.twitter.username = profile.username;
                            newUser.twitter.displayName = profile.displayName;

                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.twitter.id = profile.id;
                    user.twitter.token = token;
                    user.twitter.username = profile.username;
                    user.twitter.displayName = profile.displayName;

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }

            });

        }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

                clientID: config.get('configAuth:googleAuth:clientID'),
                clientSecret: config.get('configAuth:googleAuth:clientSecret'),
                callbackURL: config.get('configAuth:googleAuth:callbackURL'),
                passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

            },
            function (req, token, refreshToken, profile, done) {

                // asynchronous
                process.nextTick(function () {

                    // check if the user is already logged in
                    if (!req.user) {

                        User.findOne({'google.id': profile.id}, function (err, user) {
                            if (err)
                                return done(err);

                            if (user) {

                                // if there is a user id already but no token (user was linked at one point and then removed)
                                if (!user.google.token) {
                                    user.google.token = token;
                                    user.google.name = profile.displayName;
                                    user.google.email = profile.emails[0].value; // pull the first email

                                    user.save(function (err) {
                                        if (err)
                                            throw err;
                                        return done(null, user);
                                    });
                                }

                                return done(null, user);
                            } else {
                                var newUser = new User();

                                newUser.google.id = profile.id;
                                newUser.google.token = token;
                                newUser.google.name = profile.displayName;
                                newUser.google.email = profile.emails[0].value; // pull the first email

                                newUser.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, newUser);
                                });
                            }
                        });

                    } else {
                        // user already exists and is logged in, we have to link accounts
                        var user = req.user; // pull the user out of the session

                        user.google.id = profile.id;
                        user.google.token = token;
                        user.google.name = profile.displayName;
                        user.google.email = profile.emails[0].value; // pull the first email

                        user.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        });

                    }

                });

            }
        )
    );
};

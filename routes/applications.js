/**
 * Created by ricardomendes on 31/01/17.
 */
var express = require('express');
var router = express.Router();

var src = process.cwd() + '/';
var ApplicationModel = require(src + 'models/application');

// Applications
router.get('/', isLoggedIn, function (req, res) {
    ApplicationModel.find({owner: req.user}, function (err, applications) {
        if (!err) {
            if (req.query['json']) {
                res.json(applications);
            } else {
                res.render('applications/index', {user: req.user, Applications: applications});
            }
        } else {
            res.statusCode = 500;

            return res.json({
                error: 'Server error'
            });
        }
    });
});

router.get('/new', isLoggedIn, function (req, res) {
    res.render('applications/new', {
        user: req.user
    });
});

router.post('/create', isLoggedIn, function (req, res) {
    console.log(req.query);
    console.log(req.body);

    var paramObj = {
        owner: req.user,
        name: req.body['name'],
        description: req.body['description']
    };

    ApplicationModel.create(paramObj, function ApplicationCreated(err, application) {
        if (err) {
            console.log(err);
            return res.redirect('/new');
        }
        res.redirect('show?id=' + application.id);

    });
});

router.get('/show', isLoggedIn, function (req, res) {
    console.log(req.query['id']);
    console.log(req.body);

    ApplicationModel.findOne({_id: req.query['id'], owner: req.user}, function (err, application) {
        if (err) return next(err);
        if (!application) return next();
        console.log(application);
        res.render('applications/show', {
            Application: application
        });
    });
});

router.get('/edit', isLoggedIn, function (req, res) {
    ApplicationModel.findOne({_id: req.query['id'], owner: req.user}, function (err, application) {
        if (err) return next(err);
        if (!application) return next('ApplicationModel doesn\'t exist.');

        res.render('applications/edit', {
            Application: application
        });
    });
});

router.post('/update', isLoggedIn, function (req, res) {

    var paramObj = {
        name: req.body['name'],
        description: req.body['description']
    };

    ApplicationModel.update({_id: req.query['id'], owner: req.user}, paramObj, function (err) {
        if (err) {
            console.log(err);
            return res.redirect('/edit?id=' + req.query['id']);
        }
        res.redirect('/applications/show?id=' + req.query['id']);
    });
});

router.post('/destroy', isLoggedIn, function (req, res) {
    ApplicationModel.findOne({_id: req.body['id'], owner: req.user}, function (err, application) {
        if (err) return next(err);

        if (!application) return next('ApplicationModel doesn\'t exist.');

        ApplicationModel.remove({_id: req.body['id'], owner: req.user}, function (err) {

            if (err) return next(err);
        });
        res.redirect('/home');
    });
});

module.exports = router;

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
/**
 * Created by ricardomendes on 10/01/17.
 */
var express = require('express');
var router = express.Router();

var cors = require('cors');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

var src = process.cwd() + '/';
var PeerModel = require(src + 'models/peer');
var ApplicationModel = require(src + 'models/application');

// Peers
router.get('/', cors(corsOptions), function (req, res) {
//router.get('/', isLoggedIn, function (req, res) {
    PeerModel.find({owner: req.user}, function (err, peers) {
        if (!err) {
            if (req.query['json']) {
                res.json(peers);
            } else {
                res.render('peers/index', {user: req.user, Peers: peers});
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
    ApplicationModel.find({owner: req.user}, function (err, applications) {
        if (!err) {
            res.render('peers/new', {user: req.user, Applications: applications});
        } else {
            res.render('peers/new', {user: req.user});
        }
    });
});

router.post('/create', isLoggedIn, function (req, res) {
    console.log(req.query);
    console.log(req.body);

    var paramObj = {
        owner: req.user,
        name: req.body['name'],
        description: req.body['description'],
        ip: req.body['ip']
    };


    ApplicationModel.findOne({_id: req.body['application'], owner: req.user}, function (err, application) {
        if (err)
            return next(err);
        if (!application)
            return next();
        console.log(application);
        paramObj["application"] = application;
        PeerModel.create(paramObj, function PeerCreated(err, peer) {
            if (err) {
                console.log(err);
                return res.redirect('/new');
            }
            res.redirect('show?id=' + peer.id);
        });
    });
});

router.get('/show', isLoggedIn, function (req, res) {
    console.log(req.query['id']);
    console.log(req.body);

    PeerModel
        .findOne({_id: req.query['id'], owner: req.user})
        .populate('application') // only return the Persons name
        .exec(function (err, peer) {
            if (err) return handleError(err);

            res.render('peers/show', {
                Peer: peer
            });
        });


    /*PeerModel.findOne({_id: req.query['id'], owner: req.user}, function (err, peer) {
     if (err)
     return next(err);
     if (!peer)
     return next();
     console.log(peer);

     });*/
});

router.get('/edit', isLoggedIn, function (req, res) {
    PeerModel.findOne({_id: req.query['id'], owner: req.user}, function (err, peer) {
        if (err) return next(err);
        if (!peer) return next('PeerModel doesn\'t exist.');
        ApplicationModel.find({owner: req.user}, function (err, applications) {
            if (!err) {
                res.render('peers/edit', {user: req.user, Applications: applications, Peer: peer});
            }
        });
    });
});

router.post('/update', isLoggedIn, function (req, res) {

    var paramObj = {
        application: req.body['application'],
        name: req.body['name'],
        description: req.body['description'],
        ip: req.body['ip']
    };

    PeerModel.update({_id: req.query['id'], owner: req.user}, paramObj, function (err) {
        if (err) {
            console.log(err);
            return res.redirect('/edit?id=' + req.query['id']);
        }
        res.redirect('/peers/show?id=' + req.query['id']);
    });
});

router.post('/destroy', isLoggedIn, function (req, res) {
    PeerModel.findOne({_id: req.body['id'], owner: req.user}, function (err, peer) {
        if (err) return next(err);

        if (!peer) return next('PeerModel doesn\'t exist.');

        PeerModel.remove({_id: req.body['id'], owner: req.user}, function (err) {

            if (err) return next(err);
        });
        res.redirect('/home');
    });
});

module.exports = router;

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    //cors(corsOptions);
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
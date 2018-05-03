/**
 * Created by ricardomendes on 31/01/17.
 */
var express = require('express');
var router = express.Router();

var GeoJSON = require('mongoose-geojson-schema');

var src = process.cwd() + '/';
var InstallModel = require(src + 'models/install');
var InstallTypeModel = require(src + 'models/installType');

// installs
router.get('/', isLoggedIn, function (req, res) {
    InstallModel.find({owner: req.user}).exec(function (err, installs) {
        if (!err) {
            res.render('installs/index', {title: 'Smart*', user: req.user, installs: installs});
        } else {
            res.statusCode = 500;

            return res.json({
                error: 'Server error'
            });
        }
    });
});

// installs
router.get('/map', isLoggedIn, function (req, res) {
    InstallModel.find({owner: req.user}).exec(function (err, installs) {
        if (!err) {
            res.render('installs/map', {user: req.user, installs: installs});
        } else {
            res.statusCode = 500;

            return res.json({
                error: 'Server error'
            });
        }
    });
});

router.get('/new', isLoggedIn, function (req, res) {
    InstallTypeModel.find().exec(function (err, types) {
        if (!err) {
            res.render('installs/new', {
                user: req.user, types: types
            });
        } else {
            res.statusCode = 500;

            return res.json({
                error: 'Server error'
            });
        }
    });
});

router.post('/create', isLoggedIn, function (req, res) {
    var paramObj = {
        owner: req.user,
        name: req.body['name'],
        type: req.body['type'],
        description: req.body['description'],
        areaPosition: {
            type: 'Polygon',
            coordinates: [JSON.parse(req.body['areaPosition'])]
        },
        position: JSON.parse(req.body['position'])
    };

    InstallModel.create(paramObj, function installCreated(err, install) {
        if (err) {
            console.log(err);
            return res.redirect('/installs/new');
        }
        res.redirect(install.id);

    });
});

router.get('/:idInstall', isLoggedIn, function (req, res, next) {
    InstallModel.findOne({_id: req.params['idInstall'], owner: req.user})
    //.populate({path: 'type', select: 'name'})
        .populate('type')
        .exec(function (err, install) {
            if (err) return next(err);
            if (!install) return next();
            res.render('installs/show', {
                install: install
            });
        });
});

router.get('/:idInstall/edit', isLoggedIn, function (req, res, next) {
    InstallModel.findOne({_id: req.params['idInstall'], owner: req.user})
        .populate("type")
        .exec(function (err, install) {
        if (err) return next(err);
        if (!install) return next('InstallModel doesn\'t exist.');
        InstallTypeModel.find().exec(function (err, types) {
            if (!err) {
                res.render('installs/edit', {
                    install: install, types: types
                });
            } else {
                res.statusCode = 500;

                return res.json({
                    error: 'Server error'
                });
            }
        });
    });
});

router.post('/:idInstall/update', isLoggedIn, function (req, res) {


    console.log("####################################");
    console.log(req.body['areaPosition']);
    console.log("####################################");
    console.log("####################################");
    console.log(req.body['position']);
    console.log("####################################");

    var paramObj = {
        owner: req.user,
        name: req.body['name'],
        type: req.body['type'],
        description: req.body['description'],
        areaPosition: {
            type: 'Polygon',
            coordinates: [JSON.parse(req.body['areaPosition'])]
        },
        position: JSON.parse(req.body['position'])
    };


    InstallModel.update({_id: req.params['idInstall'], owner: req.user}, paramObj, function (err) {
        if (err) {
            console.log(err);
            return res.redirect('/' + req.params['idInstall'] + '/edit');
        }
        res.redirect('/installs/' + req.params['idInstall']);
    });
});

router.post('/:idInstall/destroy', isLoggedIn, function (req, res, next) {
    InstallModel.findOne({_id: req.params['idInstall'], owner: req.user}).exec(function (err, install) {
        if (err) return next(err);

        if (!install) return next('InstallModel doesn\'t exist.');

        InstallModel.remove({_id: req.params['idInstall'], owner: req.user}, function (err) {

            if (err) return next(err);
        });
        res.redirect('/installs');
    });
});

module.exports = router;

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
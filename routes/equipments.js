/**
 * Created by ricardomendes on 10/01/17.
 */
var express = require('express');
var router = express.Router();

var src = process.cwd() + '/';
var EquipmentModel = require(src + 'models/equipment');
var InstallModel = require(src + 'models/install');

// Equipments
router.get('/:idInstall/equipments', isLoggedIn, function (req, res) {
    InstallModel.findOne({
        _id: req.params['idInstall'],
        owner: req.user
    }).exec(function (err, install) {
        if (err) return next(err);
        if (!install) return next();
        EquipmentModel.find({install: req.params['idInstall'], owner: req.user}).exec(function (err, equipments) {
            if (err) return next(err);
            if (!equipments) return next();
            res.render('equipments/index', {
                equipments: equipments, install: install
            });
        });
    });
});

router.get('/:idInstall/equipments/new', isLoggedIn, function (req, res) {
    InstallModel.findOne({_id: req.params['idInstall'], owner: req.user}).exec(function (err, install) {
        if (err) return next(err);
        if (!install) return next();
        res.render('equipments/new', {user: req.user, install: install});
    });
});

router.post('/:idInstall/equipments/create', isLoggedIn, function (req, res) {
    var paramObj = {
        owner: req.user,
        name: req.body['name'],
        description: req.body['description'],
        position: JSON.parse(req.body['position']),
        ip: req.body['ip']
    };

    InstallModel.findOne({_id: req.params['idInstall'], owner: req.user}).exec(function (err, install) {
        if (err)
            return next(err);
        if (!install)
            return next();
        paramObj["install"] = install;
        EquipmentModel.create(paramObj, function EquipmentCreated(err, equipment) {
            if (err) {
                console.log(err);
                return res.redirect('equipaments/new');
            }
            res.redirect(equipment.id);
        });
    });
});

router.get('/:idInstall/equipments/:idEquipment', isLoggedIn, function (req, res) {
    InstallModel.findOne({
        _id: req.params['idInstall'],
        owner: req.user
    }).exec(function (err, install) {
        if (err) return next(err);
        if (!install) return next();
        EquipmentModel
            .findOne({_id: req.params['idEquipment'], owner: req.user})
            .exec(function (err, equipment) {
                if (err) return handleError(err);

                res.render('equipments/show', {
                    equipment: equipment, install: install
                });
            });
    });
});

router.get('/:idInstall/equipments/:idEquipment/edit', isLoggedIn, function (req, res) {
    InstallModel.findOne({
        _id: req.params['idInstall'],
        owner: req.user
    }).exec(function (err, install) {
        if (err) return next(err);
        if (!install) return next();
        EquipmentModel.findOne({
            _id: req.params['idEquipment'],
            install: req.params['idInstall'],
            owner: req.user
        }).exec(function (err, equipment) {
            if (err) return next(err);
            if (!equipment) return next('EquipmentModel doesn\'t exist.');
            res.render('equipments/edit', {user: req.user, install: install, equipment: equipment});
        });
    });
});

router.post('/:idInstall/equipments/:idEquipment/update', isLoggedIn, function (req, res) {
    var paramObj = {
        name: req.body['name'],
        description: req.body['description'],
        position: JSON.parse(req.body['position']),
        ip: req.body['ip']
    };

    EquipmentModel.update({
        _id: req.params['idEquipment'],
        install: req.params['idInstall'],
        owner: req.user
    }, paramObj, function (err) {
        if (err) {
            console.log(err);
            return res.redirect('edit');
        }
        res.redirect('../' + req.params['idEquipment']);
    });
});

router.post('/:idInstall/equipments/:idEquipment/destroy', isLoggedIn, function (req, res) {
    EquipmentModel.findOne({
        _id: req.params['idEquipment'],
        install: req.params['idInstall'],
        owner: req.user
    }).exec(function (err, equipment) {
        if (err) return next(err);

        if (!equipment) return next('EquipmentModel doesn\'t exist.');

        EquipmentModel.remove({_id: req.params['idEquipment'], owner: req.user}, function (err) {

            if (err) return next(err);
        });
        res.redirect('../../equipments');
    });
});

module.exports = router;

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
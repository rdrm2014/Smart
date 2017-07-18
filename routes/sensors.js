/**
 * Created by ricardomendes on 18/07/17.
 */
var express = require('express');
var router = express.Router();

var cors = require('cors');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

var src = process.cwd() + '/';
var EquipmentModel = require(src + 'models/equipment');
var InstallModel = require(src + 'models/install');
var SensorModel = require(src + 'models/sensor');

// Sensors
router.get('/:idInstall/equipments/:idEquipment/sensors', cors(corsOptions), function (req, res) {
    SensorModel.find({
        install: req.params['idInstall'],
        equipment: req.params['idEquipment'],
        owner: req.user
    }, function (err, sensors) {
        if (err) return next(err);
        if (!sensors) return next();
        console.log(sensors);
        res.render('sensors/index', {
            sensors: sensors
        });
    });
});

router.get('/:idInstall/equipments/:idEquipment/sensors/new', isLoggedIn, function (req, res) {
    EquipmentModel.findOne({
        _id: req.params['idEquipment'],
        install: req.params['idInstall'],
        owner: req.user
    }, function (err, equipment) {
        if (err) return next(err);
        if (!equipment) return next();
        res.render('sensors/new', {user: req.user});
    });
});

router.post('/:idInstall/equipments/:idEquipment/sensors/create', isLoggedIn, function (req, res) {
    var paramObj = {
        owner: req.user,
        name: req.body['name'],
        description: req.body['description'],
        dataType: req.body['dataType'],
        chartType: req.body['chartType']
    };

    EquipmentModel.findOne({
        _id: req.params['idEquipment'],
        install: req.params['idInstall'],
        owner: req.user
    }, function (err, equipment) {
        if (err)
            return next(err);
        if (!equipment)
            return next();
        console.log(equipment);
        paramObj["equipment"] = equipment;
        paramObj["install"] = req.params['idInstall'];
        SensorModel.create(paramObj, function SensorCreated(err, sensor) {
            if (err) {
                console.log(err);
                return res.redirect('sensor/new');
            }
            res.redirect(sensor.id);
        });
    });
});

router.get('/:idInstall/equipments/:idEquipment/sensors/:idSensor', isLoggedIn, function (req, res) {
    SensorModel
        .findOne({
            _id: req.params['idSensor'],
            install: req.params['idInstall'],
            equipment: req.params['idEquipment'],
            owner: req.user
        })
        .exec(function (err, sensor) {
            if (err) return handleError(err);

            res.render('sensors/show', {
                sensor: sensor
            });
        });
});

router.get('/:idInstall/equipments/:idEquipment/sensors/:idSensor/edit', isLoggedIn, function (req, res) {
    SensorModel.findOne({
        _id: req.params['idSensor'],
        install: req.params['idInstall'],
        equipment: req.params['idEquipment'],
        owner: req.user
    }, function (err, sensor) {
        if (err) return next(err);
        if (!sensor) return next('SensorModel doesn\'t exist.');

        res.render('sensors/edit', {user: req.user, sensor: sensor});

    });
});

router.post('/:idInstall/equipments/:idEquipment/sensors/:idSensor/update', isLoggedIn, function (req, res) {

    var paramObj = {
        name: req.body['name'],
        description: req.body['description'],
        dataType: req.body['dataType'],
        chartType: req.body['chartType']
    };

    SensorModel.update({
        _id: req.params['idSensor'],
        install: req.params['idInstall'],
        equipment: req.params['idEquipment'],
        owner: req.user
    }, paramObj, function (err) {
        if (err) {
            console.log(err);
            return res.redirect('edit');
        }
        res.redirect('../' + req.params['idSensor']);
    });
});

router.post('/:idInstall/equipments/:idEquipment/sensors/:idSensor/destroy', isLoggedIn, function (req, res) {
    SensorModel.findOne({
        _id: req.params['idSensor'],
        install: req.params['idInstall'],
        equipment: req.params['idEquipment'],
        owner: req.user
    }, function (err, sensor) {
        if (err) return next(err);

        if (!sensor) return next('SensorModel doesn\'t exist.');

        SensorModel.remove({_id: req.params['idSensor'], owner: req.user}, function (err) {

            if (err) return next(err);
        });
        res.redirect('../../sensors');
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
/**
 * @swagger
 * resourcePath: /api
 * description: All about API
 */

/**
 * Created by ricardomendes on 01/06/17.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var src = process.cwd() + '/';

var EquipmentModel = require(src + 'models/equipment');
var InstallModel = require(src + 'models/install');
var SensorModel = require(src + 'models/sensor');

var EquipmentFunctions = require(src + 'functions/equipments');
var InstallFunctions = require(src + 'functions/installs');

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: GET
 *      summary: Login with username and password
 *      responseClass: String
 *      nickname: home
 *      consumes:
 *        - text/html
 */
router.get('/', function (req, res) {
    res.json({"API":"v.1"});
});

/**
 * @swagger
 * path: /installs
 * operations:
 *   -  httpMethod: GET
 *      summary: All user installs
 *      responseClass: Install
 *      nickname: installs
 *      consumes:
 *        - text/html
 *      parameters:
 *        - owner: user
 *          description: user
 *          paramType: query
 *          required: true
 *          dataType: string
 */
router.get('/installs', isAuthenticated, function (req, res) {
    InstallModel.find({owner: req.user}, function (err, installs) {
        if (!err) {
            res.json({installs: installs});
        } else {
            res.statusCode = 500;

            return res.json({
                error: 'Server error'
            });
        }
    });
});

/**
 * @swagger
 * path: /installs/:idInstall
 * operations:
 *   -  httpMethod: GET
 *      summary: Get user install
 *      responseClass: Install
 *      nickname: install
 *      consumes:
 *        - text/html
 *      parameters:
 *        - owner: user
 *          description: user
 *          paramType: query
 *          required: true
 *          dataType: string
 */
router.get('/installs/:idInstall', isAuthenticated, function (req, res) {
    InstallModel.findOne({_id: req.params['idInstall'], owner: req.user}, function (err, install) {
        if (err) return next(err);
        if (!install) return next();
        res.json({
            install: install
        });
    });
});

/**
 * @swagger
 * path: /installs/:idInstall/equipments
 * operations:
 *   -  httpMethod: GET
 *      summary: Get user equipments in install
 *      responseClass: Equipment
 *      nickname: equipment
 *      consumes:
 *        - text/html
 *      parameters:
 *        - owner: user
 *          description: user
 *          paramType: query
 *          required: true
 *          dataType: string
 */
router.get('/installs/:idInstall/equipments', isAuthenticated, function (req, res) {
    EquipmentModel.find({install: req.params['idInstall'], owner: req.user}, function (err, equipments) {
        if (err) return next(err);
        if (!equipments) return next();
        res.json({
            equipments: equipments
        });
    });
});

/**
 * @swagger
 * path: /installs/:idInstall/equipments/count
 * operations:
 *   -  httpMethod: GET
 *      summary: Get user equipments count in install
 *      responseClass: Equipment
 *      nickname: equipment
 *      consumes:
 *        - text/html
 *      parameters:
 *        - owner: user
 *          description: user
 *          paramType: query
 *          required: true
 *          dataType: string
 */
router.get('/installs/:idInstall/equipments/count', isAuthenticated, function (req, res) {
    EquipmentModel.find({install: req.params['idInstall'], owner: req.user}, function (err, equipments) {
        if (err) return next(err);
        if (!equipments) return next();
        res.json({"count":equipments.length});
    });
});

/**
 * @swagger
 * path: /installs/:idInstall/equipments/:idEquipment
 * operations:
 *   -  httpMethod: GET
 *      summary: Get user equipments count in install
 *      responseClass: Equipment
 *      nickname: equipment
 *      consumes:
 *        - text/html
 *      parameters:
 *        - owner: user
 *          description: user
 *          paramType: query
 *          required: true
 *          dataType: string
 */
router.get('/installs/:idInstall/equipments/:idEquipment', isAuthenticated, function (req, res) {
    InstallModel.findOne({_id: req.params['idInstall'], owner: req.user}, function (err, install) {
        EquipmentModel
            .findOne({_id: req.params['idEquipment'], owner: req.user})
            .exec(function (err, equipment) {
                if (err) return handleError(err);
                res.json({equipment: equipment});
            });
    });
});

/**
 * @swagger
 * path: /installs/:idInstall/equipments/:idEquipment/sensors
 * operations:
 *   -  httpMethod: GET
 *      summary: Get user sensors in equipment
 *      responseClass: Equipment
 *      nickname: equipment
 *      consumes:
 *        - text/html
 *      parameters:
 *        - owner: user
 *          description: user
 *          paramType: query
 *          required: true
 *          dataType: string
 */
router.get('/installs/:idInstall/equipments/:idEquipment/sensors', isAuthenticated, function (req, res) {
    SensorModel.find({install: req.params['idInstall'], equipment: req.params['idEquipment'], owner: req.user}, function (err, sensors) {
        if (err) return next(err);
        if (!sensors) return next();
        res.json({
            sensors: sensors
        });
    });
});

/**
 * @swagger
 * path: /installs/:idInstall/equipments/:idEquipment/sensors/count
 * operations:
 *   -  httpMethod: GET
 *      summary: Get user sensors count in equipment
 *      responseClass: Equipment
 *      nickname: equipment
 *      consumes:
 *        - text/html
 *      parameters:
 *        - owner: user
 *          description: user
 *          paramType: query
 *          required: true
 *          dataType: string
 */
router.get('/installs/:idInstall/equipments/:idEquipment/sensors/count', isAuthenticated, function (req, res) {
    SensorModel.find({install: req.params['idInstall'], equipment: req.params['idEquipment'], owner: req.user}, function (err, sensors) {
        if (err) return next(err);
        if (!sensors) return next();
        res.json({"count": sensors.length});
    });
});


/**
 * @swagger
 * path: /installs/:idInstall/equipments/:idEquipment/sensors/:idSensor
 * operations:
 *   -  httpMethod: GET
 *      summary: Get user sensor in equipment
 *      responseClass: Equipment
 *      nickname: equipment
 *      consumes:
 *        - text/html
 *      parameters:
 *        - owner: user
 *          description: user
 *          paramType: query
 *          required: true
 *          dataType: string
 */
router.get('/installs/:idInstall/equipments/:idEquipment/sensors/:idSensor', isAuthenticated, function (req, res) {
    SensorModel
        .findOne({
            _id: req.params['idSensor'],
            install: req.params['idInstall'],
            equipment: req.params['idEquipment'],
            owner: req.user
        })
        .exec(function (err, sensor) {
            if (err) return handleError(err);
            res.json({sensor: sensor});
        });
});

module.exports = router;

// route middleware to ensure user is logged in
function isAuthenticated(req, res, next) {
    //if (req.isAuthenticated())
        return next();

    //res.redirect('/');
}
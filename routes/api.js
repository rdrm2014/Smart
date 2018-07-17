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
var passport = require('passport');

var EquipmentModel = require(src + 'models/equipment');
var InstallModel = require(src + 'models/install');
var SensorModel = require(src + 'models/sensor');

var filesCreator = require(src + 'functions/filesCreator');

var config = require(src + "config/config");

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
    res.json({"API": "v.1"});
});

router.get('/json', function (req, res) {
    var locationSettingsFile = config.get('nodeRed:pathSettings') + "settings_" + req.user._id + ".js";
    var locationFlowFile = config.get('nodeRed:pathFlows') + "flow_" + req.user._id + ".json";

    filesCreator.settingsCreator(req.user, src + "templates/settings_template.js", {
        uiPort: 1885,
        idUser: req.user._id,
        userDir: config.get('nodeRed:path')
    }, locationSettingsFile);

    filesCreator.jsonCreator(req.user, locationFlowFile, function (err, err1) {
        console.log("ERRORR: " + err + "\n" + err1);
    });
    return res.json({
        message: 'Success!'
    });
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
router.get('/installs', passport.authenticate('jwt', {session: false}), function (req, res) {
    var limit = req.params['limit'] > 0 ? req.params['limit'] : 2,
        offset = req.params['offset'] > 0 ? req.params['offset'] : 0,
        sort = req.params['sort'] !='' ? req.params['sort'] : '';

    InstallModel.find({owner: req.user})
        .limit(limit)
        .skip(limit * offset)
        .sort(sort)
        .populate('type').exec(function (err, installs) {
        if (!err) {
            res.json(installs);
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
 * path: /installs/count
 * operations:
 *   -  httpMethod: GET
 *      summary: Get user install count
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
router.get('/installs/count', passport.authenticate('jwt', {session: false}), function (req, res) {
    InstallModel.find({owner: req.user}).exec(function (err, installs) {
        if (err) return next(err);
        if (!installs) return next();
        res.json({"count": installs.length});
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
router.get('/installs/:idInstall', passport.authenticate('jwt', {session: false}), function (req, res) {
    InstallModel.findOne({
        _id: req.params['idInstall'],
        owner: req.user
    }).populate('type').exec(function (err, install) {
        if (err) return next(err);
        if (!install) return next();
        res.json(install);
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
router.get('/installs/:idInstall/equipments', passport.authenticate('jwt', {session: false}), function (req, res) {
    var limit = req.params['limit'] > 0 ? req.params['limit'] : 2,
        offset = req.params['offset'] > 0 ? req.params['offset'] : 0,
        sort = req.params['sort'] !='' ? req.params['sort'] : '';

    EquipmentModel.find({install: req.params['idInstall'], owner: req.user})
        .limit(limit)
        .skip(limit * offset)
        .sort(sort)
        .exec(function (err, equipments) {
        if (err) return next(err);
        if (!equipments) return next();
        //res.json({equipments: equipments});
        res.json(equipments);
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
router.get('/installs/:idInstall/equipments/count', passport.authenticate('jwt', {session: false}), function (req, res) {
    EquipmentModel.find({install: req.params['idInstall'], owner: req.user}).exec(function (err, equipments) {
        if (err) return next(err);
        if (!equipments) return next();
        res.json({"count": equipments.length});
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
router.get('/installs/:idInstall/equipments/:idEquipment', passport.authenticate('jwt', {session: false}), function (req, res) {
    InstallModel.findOne({_id: req.params['idInstall'], owner: req.user}).exec(function (err, install) {
        EquipmentModel
            .findOne({_id: req.params['idEquipment'], owner: req.user})
            .exec(function (err, equipment) {
                if (err) return handleError(err);
                //res.json({equipment: equipment});
                res.json(equipment);
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
router.get('/installs/:idInstall/equipments/:idEquipment/sensors', passport.authenticate('jwt', {session: false}), function (req, res) {
    var limit = req.params['limit'] > 0 ? req.params['limit'] : 2,
        offset = req.params['offset'] > 0 ? req.params['offset'] : 0,
        sort = req.params['sort'] !='' ? req.params['sort'] : '';

    SensorModel.find({
        install: req.params['idInstall'],
        equipment: req.params['idEquipment'],
        owner: req.user
    })
        .limit(limit)
        .skip(limit * offset)
        .sort(sort)
        .populate('dataType')
        .populate('chartType')
        .exec(function (err, sensors) {
            if (!err) {
                res.json(sensors);
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
router.get('/installs/:idInstall/equipments/:idEquipment/sensors/count', passport.authenticate('jwt', {session: false}), function (req, res) {
    SensorModel.find({
        install: req.params['idInstall'],
        equipment: req.params['idEquipment'],
        owner: req.user
    }).exec(function (err, sensors) {
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
router.get('/installs/:idInstall/equipments/:idEquipment/sensors/:idSensor', passport.authenticate('jwt', {session: false}), function (req, res) {
    SensorModel
        .findOne({
            _id: req.params['idSensor'],
            install: req.params['idInstall'],
            equipment: req.params['idEquipment'],
            owner: req.user
        })
        .populate('dataType')
        .populate('chartType')
        .exec(function (err, sensor) {
            if (!err) {
                res.json(sensor);
            } else {
                res.statusCode = 500;

                return res.json({
                    error: 'Server error'
                });
            }
        });
});

module.exports = router;

// route middleware to ensure user is logged in
function isAuthenticated(req, res, next) {
    //if (req.passport.authenticate('jwt', { session: false })())
    return next();

    //res.redirect('/');
}
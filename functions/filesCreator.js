/**
 * Created by ricardomendes on 01/09/17.
 */
var fs = require('fs');
var Mustache = require('mustache');

var async = require('async');

var src = process.cwd() + '/';
var InstallModel = require(src + 'models/install');
var EquipmentModel = require(src + 'models/equipment');
var SensorModel = require(src + 'models/sensor');

var config = require(src + "config/config");

module.exports = {
    jsonCreator: function (user, finalFile, callback) {
        // View Installs list
        InstallModel.find({owner: user}).exec(function (err1, installs) {
            if (err1 || !installs.length) {
                console.log('InstallModel.find was a problem');
                callback(err1, null);
            } else {
                var jsonFull = [];

                // Flow Template Broker
                fs.readFile(src + "templates/nodeRed_flow_template_broker.json", 'utf8', function (err, template) {
                    if (!err) {
                        var jsonBroker = Mustache.render(template, {
                            ipBroker: config.get('broker:ip'),
                            portBoker: config.get('broker:port')
                        });
                        jsonFull = jsonFull.concat(JSON.parse(jsonBroker));
                    }
                });

                installs.forEach(function (install) {
                    var x = 100, y = 50;

                    // Flow Template Install Tab
                    fs.readFile(src + "templates/nodeRed_flow_template_install_tab.json", 'utf8', function (err, template) {
                        if (!err) {
                            var jsonInstallTab = Mustache.render(template, {
                                installID: install._id,
                                installName: install.name
                            });
                            jsonFull = jsonFull.concat(JSON.parse(jsonInstallTab));
                        }
                    });

                    //View Equipments list
                    EquipmentModel.find({install: install, owner: user}).exec(function (err2, equipments) {
                        if (err2 || !equipments.length) {
                            console.log('EquipmentModel.find was a problem');
                            callback(err2, null);
                        } else {
                            equipments.forEach(function (equipment) {
                                // Flow Equipment Group
                                fs.readFile(src + "templates/nodeRed_flow_template_equipment_group.json", 'utf8', function (err, template) {
                                    if (!err) {
                                        var jsonEquipmentGroup = Mustache.render(template, {
                                            equipmentID: equipment._id,
                                            equipmentName: equipment.name,
                                            equipmentInstall: equipment.install
                                        });
                                        jsonFull = jsonFull.concat(JSON.parse(jsonEquipmentGroup));

                                        // View Sensors list
                                        SensorModel.find({
                                            install: install,
                                            equipment: equipment,
                                            owner: user
                                        }).exec(function (err3, sensors) {
                                            if (err3 || !sensors.length) {
                                                console.log('SensorModel.find was a problem');
                                                callback(err3, null);
                                            } else {

                                                    sensors.forEach(function (sensor) {
                                                fs.readFile(src + "templates/nodeRed_flow_template_sensor.json", 'utf8', function (err, template) {

                                                        if (!err) {
                                                            var jsonSensor = [];

                                                            y = y + 50;

                                                            if (sensor.dataType == "DHT") {
                                                                var jsonSensor1 = Mustache.render(template, {
                                                                    sensorID: sensor._id,
                                                                    sensorTypeInput: "humidade_ar",
                                                                    sensorType: "humidade_ar",
                                                                    sensorInstall: sensor.install,
                                                                    sensorParseValue: "hum",
                                                                    sensorKey: sensor._id+"_hum",
                                                                    sensorNumber: 1,
                                                                    sensorName: sensor.name,
                                                                    sensorEquipment: sensor.equipment,
                                                                    posX1: x,
                                                                    posX2: x + 200,
                                                                    posX3: x + 400,
                                                                    posX4: x + 600,
                                                                    posY: y,

                                                                    switch:false,
                                                                    chartLine:true,
                                                                    chartGauge:false
                                                                });
                                                                y = y + 50;
                                                                var jsonSensor2 = Mustache.render(template, {
                                                                    sensorID: sensor._id,
                                                                    sensorTypeInput: "temperatura_ar",
                                                                    sensorType: "temperatura_ar",
                                                                    sensorInstall: sensor.install,
                                                                    sensorParseValue: "temp",
                                                                    sensorKey: sensor._id+"_temp",
                                                                    sensorNumber: 1,
                                                                    sensorName: sensor.name,
                                                                    sensorEquipment: sensor.equipment,
                                                                    posX1: x,
                                                                    posX2: x + 200,
                                                                    posX3: x + 400,
                                                                    posX4: x + 600,
                                                                    posY: y,

                                                                    switch:false,
                                                                    chartLine:true,
                                                                    chartGauge:false
                                                                });
                                                                jsonSensor1 = JSON.parse(jsonSensor1);
                                                                jsonSensor2 = JSON.parse(jsonSensor2);
                                                                jsonSensor1 = jsonSensor1.concat(jsonSensor2);
                                                                //jsonSensor1.concat(jsonSensor2);

                                                                //jsonFull = jsonFull.concat(JSON.parse(jsonSensor1));
                                                                jsonFull = jsonFull.concat(jsonSensor1);
                                                                //jsonFull = jsonFull.concat(JSON.parse(jsonSensor2));
                                                            } else if(sensor.dataType == "relay"){
                                                                var jsonSensor1 = Mustache.render(template, {sensorID: sensor._id,sensorTypeInput: "mqtt in", sensorType: "relay", sensorInstall: sensor.install,sensorParseValue: "relay", sensorKey: sensor._id+"_"+1, sensorNumber: 1, sensorName: sensor.name,sensorEquipment: sensor.equipment,posX1: x, posX2: x + 200, posX3: x + 400, posX4: x + 600, posY: y, switch: true,chartLine: false, chartGauge: false});
                                                                y = y + 50;
                                                                var jsonSensor2 = Mustache.render(template, {sensorID: sensor._id,sensorTypeInput: "mqtt in", sensorType: "relay", sensorInstall: sensor.install,sensorParseValue: "relay", sensorKey: sensor._id+"_"+2, sensorNumber: 2, sensorName: sensor.name,sensorEquipment: sensor.equipment,posX1: x, posX2: x + 200, posX3: x + 400, posX4: x + 600, posY: y, switch: true,chartLine: false, chartGauge: false});
                                                                y = y + 50;
                                                                var jsonSensor3 = Mustache.render(template, {sensorID: sensor._id,sensorTypeInput: "mqtt in", sensorType: "relay", sensorInstall: sensor.install,sensorParseValue: "relay", sensorKey: sensor._id+"_"+3, sensorNumber: 3, sensorName: sensor.name,sensorEquipment: sensor.equipment,posX1: x, posX2: x + 200, posX3: x + 400, posX4: x + 600, posY: y, switch: true,chartLine: false, chartGauge: false});
                                                                y = y + 50;
                                                                var jsonSensor4 = Mustache.render(template, {sensorID: sensor._id,sensorTypeInput: "mqtt in", sensorType: "relay", sensorInstall: sensor.install,sensorParseValue: "relay", sensorKey: sensor._id+"_"+4, sensorNumber: 4, sensorName: sensor.name,sensorEquipment: sensor.equipment,posX1: x, posX2: x + 200, posX3: x + 400, posX4: x + 600, posY: y, switch: true,chartLine: false, chartGauge: false});


                                                                jsonSensor1 = JSON.parse(jsonSensor1);
                                                                jsonSensor2 = JSON.parse(jsonSensor2);
                                                                jsonSensor3 = JSON.parse(jsonSensor3);
                                                                jsonSensor4 = JSON.parse(jsonSensor4);

                                                                jsonSensor1 = jsonSensor1.concat(jsonSensor2);
                                                                jsonSensor1 = jsonSensor1.concat(jsonSensor3);
                                                                jsonSensor1 = jsonSensor1.concat(jsonSensor4);
                                                                //jsonSensor1.concat(jsonSensor2);

                                                                //jsonFull = jsonFull.concat(JSON.parse(jsonSensor1));
                                                                jsonFull = jsonFull.concat(jsonSensor1);
                                                                //jsonFull = jsonFull.concat(JSON.parse(jsonSensor2));
                                                                //}
                                                            } else if(sensor.chartType == "line"){
                                                                jsonSensor = Mustache.render(template, {
                                                                    sensorID: sensor._id,
                                                                    sensorTypeInput: "temperatura_ar",
                                                                    sensorType: "temperatura_ar",
                                                                    sensorInstall: sensor.install,
                                                                    sensorParseValue: "analog",
                                                                    sensorKey: sensor._id,
                                                                    sensorNumber: 1,
                                                                    sensorName: sensor.name,
                                                                    sensorEquipment: sensor.equipment,
                                                                    posX1: x,
                                                                    posX2: x + 200,
                                                                    posX3: x + 400,
                                                                    posX4: x + 600,
                                                                    posY: y,

                                                                    switch:false,
                                                                    chartLine:true,
                                                                    chartGauge:false
                                                                });
                                                                jsonFull = jsonFull.concat(JSON.parse(jsonSensor));
                                                            } else{
                                                                jsonSensor = Mustache.render(template, {
                                                                    sensorID: sensor._id,
                                                                    sensorTypeInput: "temperatura_ar",
                                                                    sensorType: "temperatura_ar",
                                                                    sensorInstall: sensor.install,
                                                                    sensorParseValue: "analog",
                                                                    sensorKey: sensor._id,
                                                                    sensorNumber: 1,
                                                                    sensorName: sensor.name,
                                                                    sensorEquipment: sensor.equipment,
                                                                    posX1: x,
                                                                    posX2: x + 200,
                                                                    posX3: x + 400,
                                                                    posX4: x + 600,
                                                                    posY: y,

                                                                    switch:false,
                                                                    chartLine:false,
                                                                    chartGauge:true
                                                                });
                                                                jsonFull = jsonFull.concat(JSON.parse(jsonSensor));

                                                            }
                                                            fs.writeFile(finalFile, JSON.stringify(jsonFull), function (errWriteFile) {
                                                                if (errWriteFile) {
                                                                    return errWriteFile;
                                                                }
                                                            });
                                                        }
                                                    });
                                                });
                                            }
                                            if (!sensors) return next();
                                        });
                                    }
                                });
                            });
                        }
                        if (!equipments) return next();
                    });
                });
            }
        });
    },

    settingsCreator: function (user, templateFile, varTemplate, finalFile) {
        fs.readFile(templateFile, 'utf8', function (err, template) {
            if (!err) {

                var settingsFile = Mustache.render(template, varTemplate);

                fs.writeFile(finalFile, settingsFile, function (err) {
                    if (err) {
                        return err;
                    }

                });

            } else {
                console.log(err);
            }
        });
    }
};
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
                fs.readFile(src + "templates/flow_template_broker.json", 'utf8', function (err, template) {
                    if (!err) {
                        var jsonBroker = Mustache.render(template, {
                            ipBroker: "192.168.0.55",
                            portBoker: 1883
                        });
                        jsonFull = jsonFull.concat(JSON.parse(jsonBroker));
                    }
                });

                installs.forEach(function (install) {
                    var x = 100, y = 50;

                    // Flow Template Install Tab
                    fs.readFile(src + "templates/flow_template_install_tab.json", 'utf8', function (err, template) {
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
                                fs.readFile(src + "templates/flow_template_equipment_group.json", 'utf8', function (err, template) {
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

                                                    fs.readFile(src + "templates/flow_template_sensor.json", 'utf8', function (err, template) {
                                                        if (!err) {
                                                            var jsonSensor = [];

                                                            y = y + 50;

                                                            // Rever chartType e datatype
                                                            if (sensor.chartType == "switch" || sensor.dataType == "switch") {
                                                                /* // Switch
                                                                 {"id":"f9487132.0f3088","type":"mqtt in","z":"35164973.dde6a6","name":"Log_Ventilação","topic":"1/ESP15976340/Relay/3/read","qos":"2","broker":"8bec196c.723a18","x":105.5,"y":247.5,"wires":[["e332128a.f39768"]]},
                                                                 */

                                                                /* // Function
                                                                 {"id":"e332128a.f39768","type":"function","z":"35164973.dde6a6","name":"","func":"var json = JSON.parse(msg[\"payload\"]);\n\nmsg[\"payload\"]=json[\"relay\"];\nreturn msg;","outputs":1,"noerr":0,"x":276.5,"y":247,"wires":[["954282ad.b0468"]]
                                                                 * */

                                                                /* // Switch
                                                                 * {"id":"954282ad.b0468","type":"ui_switch","z":"35164973.dde6a6","name":"","label":"Ventilação","group":"16ab523a.583de6","order":0,"width":0,"height":0,"passthru":true,"decouple":"false","topic":"","style":"","onvalue":"1","onvalueType":"num","onicon":"","oncolor":"","offvalue":"0","offvalueType":"num","officon":"","offcolor":"","x":419.54998779296875,"y":246.5500030517578,"wires":[["cfa94984.907238"]]},
                                                                 * */


                                                                jsonSensor = [
                                                                    // Read
                                                                    {
                                                                        "id": sensor._id + "read",
                                                                        "type": "mqtt in",
                                                                        "z": sensor.install + "",
                                                                        "name": sensor.name,
                                                                        /*<idInstall>/<idEquipment>/<idSensor>/<#number>/<read/write>;*/
                                                                        "topic": sensor.install + "/" + sensor.equipment + "/" + sensor._id + "/1/read",
                                                                        "qos": "2",
                                                                        "broker": "8bec196c.723a18",
                                                                        "x": 0,
                                                                        "y": 0,
                                                                        "wires": [[sensor._id + "function"]]
                                                                    },
                                                                    // Function
                                                                    {
                                                                        "id": sensor._id + "function",
                                                                        "type": "function",
                                                                        "z": sensor.install + "",
                                                                        "name": sensor.name + "function",
                                                                        "func": "var json = JSON.parse(msg[\"payload\"]);\n\nmsg[\"payload\"]=json[\"relay\"];\nreturn msg;",
                                                                        "outputs": 1,
                                                                        "noerr": 0,
                                                                        "x": 0,
                                                                        "y": 0,
                                                                        "wires": [[sensor._id + "write"]]
                                                                    },
                                                                    // Write
                                                                    {
                                                                        "id": sensor._id + "write",
                                                                        "type": "ui_switch",
                                                                        "z": install._id + "",
                                                                        "name": sensor.name + "write",
                                                                        "label": "sensor.name",
                                                                        //"group": equipment._id + "group",
                                                                        "group": sensor.equipment + "group",
                                                                        "order": 0,
                                                                        "width": 0,
                                                                        "height": 0,
                                                                        "passthru": true,
                                                                        "decouple": "false",
                                                                        "topic": "",
                                                                        "style": "",
                                                                        "onvalue": "1",
                                                                        "onvalueType": "num",
                                                                        "onicon": "", "oncolor": "",
                                                                        "offvalue": "0",
                                                                        "offvalueType": "num",
                                                                        "officon": "",
                                                                        "offcolor": "",
                                                                        "x": 0,
                                                                        "y": 0,
                                                                        "wires": [[sensor._id + "relay"]]
                                                                    },
                                                                    // Relay
                                                                    {
                                                                        "id": sensor._id + "relay",
                                                                        "type": "relay",
                                                                        "z": install._id + "",
                                                                        "name": sensor.name,
                                                                        "topic": sensor.install + "/" + sensor.equipment + "/" + sensor._id + "/1/write",
                                                                        "broker": "8bec196c.723a18",
                                                                        "wires": []
                                                                    }
                                                                ];

                                                            } else {//if (sensor.chartType == "switch" || sensor.dataType == "switch") {
                                                                /* // Sensor Temp
                                                                 //{"id":"12410836.7a6868","type":"ui_chart","z":"399c16fa.ee6f52","name":"","group":"4016e047.27a7f","order":1,"width":"6","height":"4","label":"Temperature","chartType":"line","interpolate":"linear","nodata":"No Data","ymin":"","ymax":"","removeOlder":1,"removeOlderUnit":"60","x":395.4499969482422,"y":521.6666259765625,"wires":[[],[]]},
                                                                 */

                                                                var jsonSensor = Mustache.render(template, {
                                                                    sensorID: sensor._id,
                                                                    sensorType: "temperatura_ar",
                                                                    sensorInstall: sensor.install,
                                                                    sensorName: sensor.name,
                                                                    sensorEquipment: sensor.equipment,
                                                                    posX1: x,
                                                                    posX2: x + 200,
                                                                    posX3: x + 400,
                                                                    posY: y
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
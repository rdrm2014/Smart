/**
 * @swagger
 * models:
 *   User:
 *     id: Equipment
 *     properties:
 *       owner:
 *         type: User
 *       install:
 *         type: Install
 *       name:
 *         type: String
 *       description:
 *         type: String
 *       ip:
 *         type: String
 */
/**
 * Created by ricardomendes on 18/07/17.
 */
var mongoose = require('mongoose');
// define the schema for our equipment model
var sensorSchema = mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    install: {type: mongoose.Schema.Types.ObjectId, ref: 'Install'},
    equipment: {type: mongoose.Schema.Types.ObjectId, ref: 'Equipment'},
    name: String,
    description: String,
    dataType: String,
    chartType: String
});

// create the model for equipments and expose it to our app
module.exports = mongoose.model('Sensor', sensorSchema);

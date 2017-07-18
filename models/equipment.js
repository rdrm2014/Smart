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
 * Created by ricardomendes on 10/01/17.
 */
var mongoose = require('mongoose');
// define the schema for our equipment model
var equipmentSchema = mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    install: {type: mongoose.Schema.Types.ObjectId, ref: 'Install'},
    name: String,
    description: String,
    position: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
    },
    ip: String
});

// create the model for equipments and expose it to our app
module.exports = mongoose.model('Equipments', equipmentSchema);

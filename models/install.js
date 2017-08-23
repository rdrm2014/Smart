/**
 * @swagger
 * models:
 *   Install:
 *     id: Install
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
 * Created by ricardomendes on 31/01/17.
 */
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

// define the schema for our install model
var installSchema = mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    name: String,
    type: {type: String, enum: ["Agricultura","Piscicultura", "Aquário"]},
    description: String,
    position: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
    },
    areaPosition: mongoose.Schema.Types.Polygon,
    equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'equipment' }]
});

// create the model for installs and expose it to our app
module.exports = mongoose.model('install', installSchema);

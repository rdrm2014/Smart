/**
 * @swagger
 * models:
 *   InstallType:
 *     id: InstallType
 *     properties:
 *       name:
 *         type: String
 *       description:
 *         type: String
 */
/**
 * Created by ricardomendes on 31/01/17.
 */
var mongoose = require('mongoose');

// define the schema for our installType model
var installTypeSchema = mongoose.Schema({
    name: String,
    description: String
});

// create the model for installTypes and expose it to our app
module.exports = mongoose.model('typeI', installTypeSchema,'typeI');

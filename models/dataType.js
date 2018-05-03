/**
 * @swagger
 * models:
 *   DataType:
 *     id: DataType
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

// define the schema for our datatype model
var datatypeSchema = mongoose.Schema({
    name: String,
    description: String
});

// create the model for dataTypes and expose it to our app
module.exports = mongoose.model('typeD', datatypeSchema, 'typeD');

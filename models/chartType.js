/**
 * @swagger
 * models:
 *   ChartType:
 *     id: ChartType
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

// define the schema for our chartType model
var charttypeSchema = mongoose.Schema({
    name: String,
    description: String
});

// create the model for chartTypes and expose it to our app
module.exports = mongoose.model('typeC', charttypeSchema,'typeC');

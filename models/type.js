/**
 * @swagger
 * models:
 *   Type:
 *     id: Type
 *     properties:
 *       owner:
 *         type: User
 *       name:
 *         type: String
 *       description:
 *         type: String
 */
/**
 * Created by ricardomendes on 31/01/17.
 */
var mongoose = require('mongoose');

// define the schema for our type model
var typeSchema = mongoose.Schema({
    name: String,
    description: String
});

// create the model for types and expose it to our app
module.exports = mongoose.model('type', typeSchema);

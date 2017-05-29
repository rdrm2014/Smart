/**
 * Created by ricardomendes on 31/01/17.
 */
var mongoose = require('mongoose');

// define the schema for our application model
var applicationSchema = mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    description: String,
    peers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Peer' }]
});

// create the model for applications and expose it to our app
module.exports = mongoose.model('Application', applicationSchema);

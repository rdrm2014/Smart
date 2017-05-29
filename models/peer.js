/**
 * Created by ricardomendes on 10/01/17.
 */
var mongoose = require('mongoose');
// define the schema for our peer model
var peerSchema = mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    application: [{type: mongoose.Schema.Types.ObjectId, ref: 'Application'}],
    name: String,
    description: String,
    ip: String
});

// create the model for peers and expose it to our app
module.exports = mongoose.model('Peer', peerSchema);

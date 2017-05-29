/**
 * Created by ricardomendes on 10/01/17.
 */
var mongoose = require('mongoose');

var nodesSchema = {
    user_id: String,
    nodes: [String]
};

module.exports = mongoose.model('Nodes', nodesSchema);
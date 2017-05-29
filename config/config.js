/**
 * Created by ricardomendes on 10/01/17.
 */
var nconf = require('nconf');

nconf.argv()
	.env()
	.file({
		file: 'config/config.json'
	});

module.exports = nconf;
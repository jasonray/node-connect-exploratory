var transform = require('./transform.js').transform;
var join = require('path').join;
var root = __dirname;
var fs = require('fs');

console.log('initializing fhir resource file');

function fetchLabs(req, res, next) {
	console.log('invoked fetch labs');

	var path = join(root, './chemistry.json');
	fs.readFile(path, 'utf8', function(err, vprData) {
		if (err) throw err;
		var fhirData = vprData.toString();

		res.setHeader('Content-Type', 'application/json+fhir');
		res.end(transform(fhirData));
	});
}

exports.fetchLabs = fetchLabs;
var numberOfActiveCalls = 0;
var totalNumberOfCalls = 0;

var logger = require('bunyan').createLogger({
	name: "active-call-counter"
});

module.exports = {

	getNumberOfActiveCalls: function() {
		return numberOfActiveCalls;
	},
	getTotalNumberOfCalls: function() {
		return totalNumberOfCalls;
	},

	activeCallFilter: function() {
		console.log('inside activeCallFilter factory method');

		return function(req, res, next) {
			console.log('inside filter method');

			totalNumberOfCalls++;
			logger.info('active calls: ' + (++numberOfActiveCalls));

			function onEndCall() {
				res.removeListener('finish', onEndCall);
				res.removeListener('close', onEndCall);
				logger.info('active calls: ' + (--numberOfActiveCalls));
			}

			res.on('finish', onEndCall);
			res.on('close', onEndCall);
			next();
		};

	},

	activeCallResource: function() {
		console.log('inside activeCallResource factory method');

		return function(req, res, next) {
			console.log('inside activeCallResource method');

			var output = "active: " + numberOfActiveCalls + "; total: " + totalNumberOfCalls + " \n";
			res.end(output);
		};

	}

};
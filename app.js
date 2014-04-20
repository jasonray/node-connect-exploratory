var connect = require("connect");
var logger = require('bunyan').createLogger({
	name: "server"
});
var port = 8888;

var numberOfActiveCalls = 0;

// I created this as a sample custom module
// counts the number of active calls and 
// the total number of calls
var activeCallFilterModule = require('./lib/request-filters/active-call-counter');

var app = connect()

.use(connect.logger('dev'))

// link the custom module to certain endpoints
.use('/api', activeCallFilterModule.activeCallFilter())
.use('/public', activeCallFilterModule.activeCallFilter())

// demonstrating that I can then have another filter
// to re-use a module for different purpose
.use(function(req, res, next) {
	logger.info('check for number of calls?');
	logger.info('active: ' + activeCallFilterModule.getNumberOfActiveCalls());
	logger.info('total: ' + activeCallFilterModule.getTotalNumberOfCalls());
	next();
})

// demonstrate that we could create a policy enforcement point (PEP)
// which would likely call out to a policy decision point (PDP)
// assume that this would have latency of 500ms
.use('/api', function(req, res, next) {
	logger.info('checking PEP');
	setTimeout(function() {
		// logger.info('end PEP');
		next();
	}, 500);
})

// this would represent an expensive resource with 2000ms latency
.use('/api/fetch/expensive', function(req, res, next) {
	// logger.info('begin resource processing, fetch data which will take 1s');
	setTimeout(function() {
		// logger.info('end fetch data');
		res.end('retrieved data \n');
	}, 2000);
})

// this would represent an expensive resource with 500ms latency
.use('/api/fetch/light', function(req, res, next) {
	// logger.info('begin resource processing, fetch data which will take 1s');
	setTimeout(function() {
		// logger.info('end fetch data');
		res.end('retrieved data \n');
	}, 500);
})

// this would represent a very light resource with no latency
.use('/public/hello', function(req, res, next) {
	res.end('hello world\n');
})

// this would represent an admin type of resource to display
// info like the number of calls currently being performed
.use('/admin/stats', activeCallFilterModule.activeCallResource());

// this starts the actual http server
require("http").createServer(app).listen(port, function() {
	logger.info("now listening on %s", port);
});
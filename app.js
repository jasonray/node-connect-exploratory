var connect = require("connect");
var logger = require('bunyan').createLogger({
	name: "server"
});
var httpPort = 8888;
var httpsPort = 8889;

var numberOfActiveCalls = 0;

// I created this as a sample custom module
// counts the number of active calls and 
// the total number of calls
var activeCallFilterModule = require('./lib/request-filters/active-call-counter');

var app = connect()

.use(connect.logger('dev'))

// this makes connect take query params and put into req
.use(connect.query())

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

// demonstrate how to get to a path param
// this is not currently working
// i think i have to add this to a router
// to behave as expected
// so commenting out for the time being
// .use('/public/echo2/:message', function(req, res, next) {
// 	console.log("params: " + req.params);
// 	var message = req.params.message;
// 	res.end(message);
// })

// demonstrate how to get to a query param
.use('/public/echo', function(req, res, next) {
	var message = req.query.m;
	res.end(message);
})


// this would represent an admin type of resource to display
// info like the number of calls currently being performed
.use('/admin/stats', activeCallFilterModule.activeCallResource());

// this starts the actual http server.  I have seen two different
// patterns to starting this, and I do not know if there is a real
// difference
// Simplified:
// app.listen(port, function() {
//   logger.info("now listening on %s", port);
// });
// Explicit:
// require("http").createServer(app).listen(port, function() {
//   logger.info("now listening on %s", port);
// });


require("http").createServer(app).listen(httpPort, function() {
	logger.info("now listening on %s", httpPort);
});
// require("https").createServer(app).listen(httpsPort, function() {
//   logger.info("now listening on %s", httpsPort);
// });
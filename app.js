var connect = require("connect");
var http = require("http");
var logger = require('bunyan').createLogger({
	name: "server"
});
var port = 8888;

var numberOfActiveCalls = 0;

var activeCallFilterModule = require('./lib/request-filters/active-call-counter');

// {"name":"server",
// "hostname":"rayj-macbookpro.jayraynet",
// "pid":14256,
// "level":30,
// "msg":"now listening on 8888",
// "time":"2014-04-19T16:07:19.346Z",
// "v":0}

var morgan = require("morgan-jayray");

var app = connect()

.use( morgan({ format: 'dev', bunyanLogger: logger }) )

.use('/api', activeCallFilterModule.activeCallFilter())
.use('/public', activeCallFilterModule.activeCallFilter())

.use(function(req, res, next) {
	logger.info('check for number of calls?');
	logger.info('active: ' + activeCallFilterModule.getNumberOfActiveCalls());
	logger.info('total: ' + activeCallFilterModule.getTotalNumberOfCalls());
	next();
})

.use('/api', function(req, res, next) {
	logger.info('checking PEP');
	setTimeout(function() {
		// logger.info('end PEP');
		next();
	}, 500);
})

.use('/api/fetch/expensive', function(req, res, next) {
	// logger.info('begin resource processing, fetch data which will take 1s');
	setTimeout(function() {
		// logger.info('end fetch data');
		res.end('retrieved data \n');
	}, 2000);
})

.use('/api/fetch/light', function(req, res, next) {
	// logger.info('begin resource processing, fetch data which will take 1s');
	setTimeout(function() {
		// logger.info('end fetch data');
		res.end('retrieved data \n');
	}, 500);
})

.use('/public/hello', function(req, res, next) {
	res.end('hello world\n');
})

.use('/admin/stats', activeCallFilterModule.activeCallResource());

http.createServer(app).listen(port, function() {
	logger.info("now listening on %s", port);
});
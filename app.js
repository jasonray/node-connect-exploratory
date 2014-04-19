var connect = require("connect");
var http = require("http");
var logger = require('bunyan').createLogger({
		name: "server"
	});

var numberOfActiveCalls = 0;
var app = connect()
	.use(connect.logger('dev'))

.use(function(req, res, next) {
	console.log('active calls: ' + (++numberOfActiveCalls));

	function onEndCall() {
		res.removeListener('finish', onEndCall);
		res.removeListener('close', onEndCall);
		console.log('active calls: ' + (--numberOfActiveCalls));
	}

	res.on('finish', onEndCall);
	res.on('close', onEndCall);
	next();
})

.use('/api', function(req, res, next) {
	console.log('checking PEP');
	setTimeout(function() {
		// console.log('end PEP');
		next();
	}, 500);
})

.use('/api/fetch/expensive', function(req, res, next) {
	// console.log('begin resource processing, fetch data which will take 1s');
	setTimeout(function() {
		// console.log('end fetch data');
		res.end('retrieved data \n');
	}, 2000);
})

.use('/api/fetch/light', function(req, res, next) {
	// console.log('begin resource processing, fetch data which will take 1s');
	setTimeout(function() {
		// console.log('end fetch data');
		res.end('retrieved data \n');
	}, 500);
})

.use('/public/hello', function(req, res, next) {
	res.end('hello world\n');
});

http.createServer(app).listen(8888);

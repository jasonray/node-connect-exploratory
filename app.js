var connect = require("connect");
var http = require("http");

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

.use(function(req, res, next) {
	// console.log('begin PEP');
	setTimeout(function() {
		// console.log('end PEP');
		next();
	}, 500);
})

.use(function(req, res, next) {
	// console.log('begin resource processing, fetch data which will take 1s');
	setTimeout(function() {
		// console.log('end fetch data');
		res.end('hello world\n');
	}, 1000);
});

http.createServer(app).listen(8888);
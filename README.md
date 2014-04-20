Purpose
=======
This project is simply to experiment with building a web service using node.js (this time with connect).  Don't look to get any value by viewing this.  None.

The project uses:
- `connect` for handling the http listener and routing


Install it
==========
Install node:
```
brew install node
```


Install node dependencies
```
npm install 
```

Run it
======
Easiest, run the startup script (you may need to `chmod a+x run.sh`)
```
./run.sh
```

This script runs node with app.js, and pipes the output to a bunyan formatter to make the stdout easier to read.

To run manually, run `node` with app.js:
```
node app.js
```

Consume it
==========

Hello
-----
The `hello` web service returns a simple hello world phrase.

A simple usage of it would be:
```
> curl -i http://127.0.0.1:8888/public/hello
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 13
Date: Tue, 15 Apr 2014 11:52:09 GMT
Connection: keep-alive

"hello world"
```

Expensive Fetch
---------------
The `expensive` web service returns a sample output, and takes about 2.5 seconds.

A simple usage of it would be:
```
> curl -i http://127.0.0.1:8888/api/fetch/expensive
HTTP/1.1 200 OK
Date: Sun, 20 Apr 2014 12:25:33 GMT
Connection: keep-alive
Transfer-Encoding: chunked

retrieved data 
```

Light Fetch
-----------
The `light` web service returns a sample output, and takes about 1 seconds.

A simple usage of it would be:
```
> curl -i http://127.0.0.1:8888/api/fetch/light
HTTP/1.1 200 OK
Date: Sun, 20 Apr 2014 12:25:33 GMT
Connection: keep-alive
Transfer-Encoding: chunked

retrieved data 
```

Admin Stats
-----------
The `stats` web service returns the number of calls currently being executed.

Usage:
```
jayray> curl -i http://127.0.0.1:8888/admin/stats
HTTP/1.1 200 OK
Date: Sun, 20 Apr 2014 12:27:35 GMT
Connection: keep-alive
Transfer-Encoding: chunked

active: 0; total: 1 
```

Notes
=====
These notes are more on discovery related to node.js, and less related to this particular project.

Directory structure
-------------------
* `/libs`: custom classes/functions/modules
* `/spec`: acceptance tests
* `/tests`: unit tests
* `/resources`: API endpoints, consider adding `/resources/{resource}/libs` to group functionality

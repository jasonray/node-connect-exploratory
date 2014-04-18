Purpose
=======
This project is simply to experiment with building a web service using node.js (this time with connect).  Don't look to get any value by viewing this.  None.

The project uses:
- `connect` for handling the http listener and routing


Install
=======
Install node:
```
brew install node
```


Install node dependencies
```
npm install 
```

Usage
=====
To run, run `node` with app.js:
```
node app.js
```

Hello
-----
The `hello` service returns a simple hello world phrase.

A simple usage of it would be:
```
> curl -i http://127.0.0.1:8888/hello?q=q
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 13
Date: Tue, 15 Apr 2014 11:52:09 GMT
Connection: keep-alive

"hello world"
```

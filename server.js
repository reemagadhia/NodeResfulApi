const http = require('http'); //import http package
const app = require('./app');

const port =  3000; //Setting port

const server = http.createServer(app); //Express app qualifies as the request handler

server.listen(port); //Will listen to this port and execute the function defined
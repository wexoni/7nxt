'use strict';


var Boom = require('boom'),
    Hapi = require('hapi'),
    mongojs = require('mongojs'),
    X_Authorization_Token = "letmein",
    headerName = "x-authorization";

var plugins = [
    require('./routes/entities')
];

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    port: 3000
});

//Add preflight checkup for presence and value of header
server.ext('onPreHandler', function (request, reply) {
    var header = request.headers[headerName];
    if(header === X_Authorization_Token){
        return reply.continue();
    }
     return reply(Boom.unauthorized());
});


//Database Connection
server.app.db = mongojs('hapi-rest-mongo', ['entities']);

//Load plugins and start server
server.register(plugins, function (err) {

    if (err) {
        throw err;
    }

    // Start the server
    server.start(function (err) {
        console.log('Server running at:', server.info.uri);
    });
});
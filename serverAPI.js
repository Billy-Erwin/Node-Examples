//Module starts api server
//@author: Billy Erwin, 7-14-2015

var http = require('http');
var https = require('https');
var fs = require('fs');
var apiDataAccess = require('./apiDataAccess');
var authenticate = require('./authenticateAPI.js');
var routeAPI = require('./routeAPI.js');

var server = http.createServer(function(req, resp){

  apiDataAccess.cleanBlackList(function(msg){

    if(msg !== ''){

      apiDataAccess.logger(msg);
    }
    routeAPI.routeRequest(req, resp);
  });

});

server.listen(3000);

// HTTPS server should work with proper certs.  Node does
// not like the self signed cert I provided

// var options = {
//   key: fs.readFileSync('./billys-key.pem'),
//   cert: fs.readFileSync('./billys-cert.pem')
// };
//
// var sServer = https.createServer(options, function(req, resp){
//
//   apiDataAccess.cleanBlackList(function(msg){
//     console.log(msg);
//     routeAPI.routeRequest(req, resp);
//   });
//
// })
//
// sServer.listen(443);

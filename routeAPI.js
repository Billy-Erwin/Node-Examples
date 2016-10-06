//Module handles incomming requests, routing them to the proper resources
//@author: Billy Erwin, 7-14-2015

var url = require('url');
var token = require('./tokenAPI');
var apiDataAccess = require('./apiDataAccess');

//routes
var defaultRoute = require('./defaultRoute');
var login = require('./login');
var logout = require('./logout');
var getConfigurations = require('./getConfigurations');
var createConfiguration = require('./createConfiguration');
var deleteConfiguration = require('./deleteConfiguration');
var updateConfiguration = require('./updateConfiguration');

//Looks at incomming url and routes to proper resource
//
//@param req = HTTP request object
//@param resp = HTTP response object
exports.routeRequest = function(req, resp){

  var urlObj = url.parse(req.url, true);
  var resourcePath = urlObj.pathname.toString();

  if(apiDataAccess.isResourceAvailable(resourcePath) === false){

    defaultRoute(req, resp);

  } else if(resourcePath === '/api/login'){

      login(req, resp);

  } else if(token.verifyToken(req) === true){

      if(resourcePath === '/api/logout'){

        logout(req, resp);

      } else if(resourcePath === '/api/getConfigurations'){

        getConfigurations(req, resp);

      } else if(resourcePath === '/api/createConfiguration'){

        createConfiguration(req, resp);

      } else if(resourcePath === '/api/deleteConfiguration'){

        deleteConfiguration(req, resp);

      } else if(resourcePath === '/api/updateConfiguration'){

        updateConfiguration(req, resp);

      }

  } else {

    var body = {msg: 'invalid token'}
    resp.writeHead(401, {'Content-Type': 'application/json'});
    resp.end(JSON.stringify(body));

  }
}

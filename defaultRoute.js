//Module handles default routing
//@author: Billy Erwin, 7-14-2015

var url = require('url');
var apiDataAccess = require('./apiDataAccess');

//defaultRoute
module.exports = function(req, resp){

  var body = {
              method: req.method,
              path: url.parse(req.url, true).pathname.toString(),
              msg: 'Resourse not found.'
            };

  apiDataAccess.logger(JSON.stringify(body));
  resp.writeHead(404, {'Content-Type': 'application/json'});
  resp.end(JSON.stringify(body));

}

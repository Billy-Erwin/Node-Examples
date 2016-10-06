//Module handles creating configurations
//@author: Billy Erwin, 7-14-2015

var apiToolBox = require('./apiToolBox');
var apiDataAccess = require('./apiDataAccess');
var url = require('url');

//Create configurations - POST
module.exports = function(req, resp){

  if(req.method === 'POST'){

    req.on('data', function(data){

      var config = JSON.parse(data);
      if(apiToolBox.validateConfig(config)){

        apiDataAccess.addConfiguration(config, function(message){

          var body =
                    {
                      method: req.method,
                      path: url.parse(req.url, true).pathname.toString(),
                      msg: message
                    };

          apiDataAccess.logger(JSON.stringify(body));
          resp.writeHead(200, {'Content-Type': 'application/json'});
          resp.end(JSON.stringify(body));

        });
      } else {

        var message = {
          msg: 'Incorrect Configuration Data for ' + req.url
        }
        apiDataAccess.logger(JSON.stringify(message));
        resp.writeHead(400, {'Content-Type': 'application/json'});
        resp.end(JSON.stringify(message));

      }

    });

  } else {

    var message = {
      msg: 'Incorrect HTTP Method.  Use a POST for ' + req.url
    }
    apiDataAccess.logger(JSON.stringify(message));
    resp.writeHead(405, {'Content-Type': 'application/json'});
    resp.end(JSON.stringify(message));

  }

}

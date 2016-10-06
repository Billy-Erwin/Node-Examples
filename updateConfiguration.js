//Module handles updating configurations
//@author: Billy Erwin, 7-14-2015

var apiToolBox = require('./apiToolBox');
var url = require('url');
var apiDataAccess = require('./apiDataAccess');

//Update configurations - PUT
module.exports = function(req, resp){

  if(req.method === 'PUT'){

    req.on('data', function(data){
      var configs = JSON.parse(data);
      var oldConfig = configs.oldConfig;
      var newConfig = configs.newConfig;

      if(apiToolBox.validateConfig(oldConfig) && apiToolBox.validateConfig(newConfig)){

        apiDataAccess.updateConfiguration(oldConfig, newConfig, function(message){

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
      msg: 'Incorrect HTTP Method.  Use a PUT for ' + req.url
    }

    apiDataAccess.logger(JSON.stringify(message));
    resp.writeHead(405, {'Content-Type': 'application/json'});
    resp.end(JSON.stringify(message));

  }

}

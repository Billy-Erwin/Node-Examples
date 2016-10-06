//Module handles logging out
//@author: Billy Erwin, 7-14-2015

var apiDataAccess = require('./apiDataAccess');
var url = require('url');

//Logout - POST
module.exports = function(req, resp){

  if(req.method === 'POST'){

    var token = req.headers.token;
    apiDataAccess.addToBlackList(token, function(){

      var body = {
                  method: req.method,
                  path: url.parse(req.url, true).pathname.toString(),
                  msg: 'Logout Successful'
                  };

      apiDataAccess.logger(JSON.stringify(body));
      resp.writeHead(200, {'Content-Type': 'application/json'});
      resp.end(JSON.stringify(body));

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

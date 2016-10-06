//Module handles logging in
//@author: Billy Erwin, 7-14-2015

var authenticate = require('./authenticateApi');
var apiDataAccess = require('./apiDataAccess');
var token = require('./tokenAPI');

//Login - POST
// exports.loginRoute = function(req, resp){
module.exports = function(req, resp){

  if(req.method === 'POST'){

    var message = authenticate.authenticateUser(req);

    if(message === true){

      var apiToken = token.createToken(req);

      var body = {msg: "User authenticated.  Retrieve token from header"}

      apiDataAccess.logger(JSON.stringify(body));
      resp.writeHead(200, {'Content-Type': 'application/json',
                            'token': apiToken});
      resp.end(JSON.stringify(body));

    } else{

      var body = {msg: message};
      apiDataAccess.logger(JSON.stringify(body));
      resp.writeHead(401, {'Content-Type': 'application/json'});
      resp.end(JSON.stringify(body));

    }
  } else {

    var message = {
      msg: 'Incorrect HTTP Method.  Use a POST for ' + req.url
    }

    apiDataAccess.logger(JSON.stringify(message));
    resp.writeHead(405, {'Content-Type': 'application/json'});
    resp.end(JSON.stringify(message));
  }
}

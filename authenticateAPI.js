//Module authenticates user by username, password
//@author: Billy Erwin, 7-14-2015

var url = require('url');
var fs = require('fs');

//Authenticates user info pulled from requests
//
//@param req = http request object
exports.authenticateUser = function(req){

  if(req === null)
    return('Null req object');
  else if(req.headers === null)
    return('Missing headers');
  else if(req.headers.authorization === null || req.headers.authorization === undefined)
    return('Missing Authorization parms:' +
    ' Please supply base64 encoded "username:password" in authorization header');
  else{

    try{

      var buf = new Buffer(req.headers.authorization.toString(), 'base64')
      var userData = JSON.parse(buf);

      return checkUsers(userData.username, userData.password);

    } catch(e){

      return('Something went wrong during authentication.  Error message: ' + e.message);
    }
  }
}

//Authenticates incomming username and password
//
//@param username
//@param password
function checkUsers(username, password){

  var userFile = fs.readFileSync('./users.json');
  var jsonData = JSON.parse(userFile);

  for(var i = 0; i < jsonData.users.length; i++){

    if(jsonData.users[i].username === username){

      if(jsonData.users[i].password === password){

        return true;

      } else{

        return('Incorrect Password');

      }
    }
  }
  return('Invalid Username');
}

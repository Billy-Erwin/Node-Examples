//Module creates and verifies tokens
//@author: Billy Erwin, 7-14-2015

var crypto = require('crypto');
var fs = require('fs');
var apiToolBox = require('./apiToolBox.js')
var apiDataAccess = require('./apiDataAccess.js');

//Sign token with hash
//
//@param text = data to be encrypted
function signToken(text){

    var secret = fs.readFileSync('./fdoc02lkp.txt');
    var hash = crypto.createHmac('sha512', secret);
    hash.update(text);
    var value = hash.digest('base64');
    return value;

}

//Check that signature is valid

//@param user = base64 encoded username
//@param exp = base64 encoded expireTime
//@param signature = base64 encoded signature
function verifySignature(user, exp, signature){
  return (signToken(user + exp) === signature);
}

//Check to see if token is expired
//
//@param expireTime = time token expires
function isExpired(expireTime){
  return +expireTime < apiToolBox.getCurrentTime();
}

//Check to see if the token is blacklisted
//
//@param token = the token to check
function isBlackListed(token){

  var blackList = JSON.parse(fs.readFileSync('./blackList.json')).blackList;

  for(var i = 0; i < blackList.length; i++){

    if(token === blackList[i]){
      return true;
    }
  }
  return false;
}

//Looks to see if the token has less than a minute
//to live.
//
//@param expireTime = the time the token expires(string) yyyymmddhhss
function refreshToken(expireTime){
  return +expireTime < apiToolBox.getCurrentTime() + 60;
}

//Check that the token has a valid signature, is not expired,
//and is not on the black list. Additionally, issue a new token
//if the token has less than a minute to live
//
//@param req = HTTP request object
exports.verifyToken = function(req){

  if(req.headers.token === undefined){
    return false;
  }
  var token = req.headers.token;
  var user = token.substring(0, token.indexOf('.'));
  var exp = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
  var sign = token.substring(token.lastIndexOf('.') + 1);

  if(verifySignature(user, exp, sign) === false){
    return false;
  }

  if(isExpired(new Buffer(exp.toString(), 'base64')) === true){
    return false;
  }

  if(isBlackListed(token) === true){
    return false;
  }

  if(refreshToken(new Buffer(exp.toString(), 'base64')) === true){

    apiDataAccess.addToBlackList(req.headers.token, function(){});

    var expires = new Buffer(apiToolBox.setExpireTime()).toString('base64');
    var signature = signToken(user + expires);
    req.headers.token =  user + '.' + expires + '.' + signature;

  }

  return true;

}

//Create a new token
//
//@param req = HTTP request object
exports.createToken = function(req){

  var buf = new Buffer(req.headers.authorization.toString(), 'base64')
  var userData = JSON.parse(buf);

  var user = new Buffer(userData.username).toString('base64');
  var expires = new Buffer(apiToolBox.setExpireTime()).toString('base64');
  var signature = signToken(user + expires);

  var token = user + '.' + expires + '.' + signature;

  return token;

}

//Module provides general tools used throughout the project
//@author: Billy Erwin, 7-14-2015

var fs = require('fs');

//return current time in yyyymmddss int format
exports.getCurrentTime = function(){

  var currentTime = 0;
  var dt = new Date();

  var year = dt.getFullYear() * 10000000000;
  var month = (dt.getMonth() + 1) * 100000000;
  var day = dt.getDate() * 1000000;
  var hour = dt.getHours() * 10000;
  var min = dt.getMinutes() * 100;
  var sec = dt.getSeconds();

  currentTime = year + month + day + hour + min + sec;

  return currentTime;

}

//return expiration time for tokens in yyyymmddss string format
exports.setExpireTime = function(){

  return (this.getCurrentTime() + 300).toString();

}

//Sort configuration array by provided field
//
//@param field = field to be sorted by
exports.sortBy = function(field, callback){

  var body = require('./configurations.json');

  if(field === 'name'){
    body.configurations.sort(function(a, b){
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }
  else if(field === 'hostname'){
    body.configurations.sort(function(a, b){
      if (a.hostname > b.hostname) {
        return 1;
      }
      if (a.hostname < b.hostname) {
        return -1;
      }
      return 0;
    });
  }
  else if(field === 'port'){
    body.configurations.sort(function(a, b){
      if (a.port > b.port) {
        return 1;
      }
      if (a.port < b.port) {
        return -1;
      }
      return 0;
    });
  }
  else if(field === 'username'){
    body.configurations.sort(function(a, b){
      if (a.username > b.username) {
        return 1;
      }
      if (a.username < b.username) {
        return -1;
      }
      return 0;
    });
  }

  callback(body);

}

//implements pagination
//
//@param body = JSON object containing list of configurations
//@param page = page number requested
//@param inc = number of results displayed per page
exports.paginate = function(body, page, inc, callback){

  var listSize = body.configurations.length;
  var lastPage = 0;
  var offset = (page * inc) - inc;
  var dividesEvenly = false;

  if(listSize % inc === 0){
    dividesEvenly = true;
    lastPage = listSize / 0;
  }

  else if(listSize % inc > 0){
    dividesEvenly = false;
    lastPage = parseInt(listSize / inc) + 1;
  }

  if(page > lastPage){

    message = {
      msg: 'Pagination parameters greater than list size. List size = ' + listSize
    }
    callback(message);

  } else {

    if(page === lastPage && !dividesEvenly){
      inc = listSize % inc;
    }

    var pageList = new Array();

    for(var i = 0; i < inc; i++){
      pageList.push(body.configurations[i + offset])
    }

    var config = {
      configurations : pageList
    }

    callback(config);
  }
}

//Validate the contents of the incomming config object
//
//@param config = configuration JSON object
exports.validateConfig = function(config){

  if(config.name){
    if(typeof config.name !== 'string'){
      return false;
    }
    else if(config.name.length === 0){
      return false;
    }
  } else {
    return false;
  }

  if(config.hostname){
    if(typeof config.hostname !== 'string'){
      return false;
    }
    else if(config.hostname.length === 0){
      return false;
    }
  } else {
    return false
  }

  if(config.port){
    if(config.port !== parseInt(config.port, 10)){
      return false;
    } else if(config.port <= 0){
      return false
    }
  } else {
    return false
  }

  if(config.username){
    if(typeof config.username !== 'string'){
      return false;
    }
    else if(config.username.length === 0){
      return false;
    }
  } else {
    return false
  }
  return true;
}

//Validate the contents of the incomming config object
//
//@param config = configuration JSON object
exports.validateOptions = function(options){

  if(options.sortBy){
    if(typeof options.sortBy !== 'string'){
      return false;
    }
  } else {
    return false;
  }

  if(options.pageNumber){
    if(options.pageNumber !== parseInt(options.pageNumber, 10)){
      return false;
    } else if(options.pageNumber <= 0){
      return false
    }
  } else {
    return false
  }

  if(options.resultsPerPage){
    if(options.resultsPerPage !== parseInt(options.resultsPerPage, 10)){
      return false;
    } else if(options.resultsPerPage <= 0){
      return false
    }
  } else {
    return false
  }

  if(typeof options.showAll !== 'boolean'){
    return false;
  }
  return true;
}

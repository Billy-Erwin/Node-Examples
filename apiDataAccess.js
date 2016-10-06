//Module provides access to system files
//@author: Billy Erwin, 7-14-2015

var fs = require('fs');
var apiToolBox = require('./apiToolBox.js');


//Check a list of resources to see if requested resource exists
//
//@ param resourceName = url pathname
exports.isResourceAvailable = function(resourceName){

  var resourceFileName = './resourceList.json';
  var resourceFile = require(resourceFileName);

  for(var i = 0; i < resourceFile.availableResources.length; i++){
    if(JSON.stringify(resourceName) === JSON.stringify(resourceFile.availableResources[i])){
      return true;
    }
  }
  return false;
}

//Add token to blackList
//
//@param token = token to be added to blacklist
exports.addToBlackList = function(token, callback){

  var blackListFileName = './blackList.json';
  var blackListFile = require(blackListFileName);

  var value = token;

  try{

    fs.readFile(blackListFileName, function(err, data){
      var index = JSON.parse(data).blackList.length;
      blackListFile.blackList[index] = value;

      try {

        fs.writeFile(blackListFileName, JSON.stringify(blackListFile));
        callback('Token added to blackList');

      } catch(e){ callback(e.message); }

    })

  } catch(e){ callback(e.message); }

}

//Remove expired tokens from blackList
exports.cleanBlackList = function(callback){

  var blackListFileName = './blackList.json';
  var blackListFile = require(blackListFileName);

  try{

    fs.readFile(blackListFileName, function(err, data){

    var cleanedBlackList = new Array();

      for(var i = 0; i < blackListFile.blackList.length; i++){

        var token = blackListFile.blackList[i];
        var exp = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
        var expTime = new Buffer(exp.toString(), 'base64');

        if(+expTime > apiToolBox.getCurrentTime()){

          cleanedBlackList.push(token);

        }

      }

      var deletedTokenCnt = blackListFile.blackList.length - cleanedBlackList.length;



      if(deletedTokenCnt === 0){
        callback('');
      } else {

        blackListFile.blackList = cleanedBlackList;

        try {

          fs.writeFile(blackListFileName, JSON.stringify(blackListFile));
          callback(deletedTokenCnt + ' expired tokens removed from blacklist');

        } catch(e){ callback(e.message); }
      }
    });

  } catch(e){ callback(e.message); }

}

//Add new configuration to configuration file
//
//@param configuration = configuration to be added
exports.addConfiguration = function(configuration, callback){

  var configFileName = ('./configurations.json');
  var configFile = require(configFileName);
  var duplicate = false;
  var message = '';

  for(var i = 0; i < configFile.configurations.length; i++){

    if(JSON.stringify(configuration) === JSON.stringify(configFile.configurations[i])){
      duplicate = true;
      message = 'Duplicate configuration found.';
      break;
    }

    if(configFile.configurations[i].name === configuration.name){
      duplicate =  true;
      message = 'Name field not unique';
      break;
    }

    if(configFile.configurations[i].hostname === configuration.hostname){
      duplicate =  true;
      message = 'Hostname field not unique';
      break;
    }

  }

  if(duplicate){

    callback(message);

  } else if(!duplicate){

    try{

      fs.readFile(configFileName, function(err, data){

        var index = JSON.parse(data).configurations.length;

        configFile.configurations[index] = configuration;

        try{

          fs.writeFileSync(configFileName, JSON.stringify(configFile));
          callback('Configuration added successfully');

        } catch(e){ callback(e.message); }

      });

    } catch(e){ callback(e.message); }
  }
}

//Delete configurations from file
//
//@param configuration = configuration to be deleted
exports.deleteConfiguration = function(configuration, callback){

  var configFileName = ('./configurations.json');
  var configFile = require(configFileName);
  var configFound = false;
  var message = '';

  try{

    fs.readFile(configFileName, function(err, data){

      for(var i = 0; i < configFile.configurations.length; i++){

        if(JSON.stringify(configuration) === JSON.stringify(configFile.configurations[i])){

          configFound = true;
          configFile.configurations.splice(i, 1);

        }

      }

      if(!configFound){

        callback('Configuration not found');

      } else {

        try{

          fs.writeFileSync(configFileName, JSON.stringify(configFile));
          callback('Configuration deleted successfully');

        } catch(e){ callback(e.message); }

      }

    });

  } catch(e){ callback(e.message); }


}

//Update configuration
//
//@param oldConfiguration = configuration to be updated
//@param newConfiguration = new values for oldConfiguration
exports.updateConfiguration = function(oldConfiguration, newConfiguration, callback){

  var configFileName = ('./configurations.json');
  var configFile = require(configFileName);
  var duplicate = false;
  var oldConfigFound = false;
  var indexOfOld = 0;
  var message = '';

  for(var i = 0; i < configFile.configurations.length; i++){

    if(JSON.stringify(oldConfiguration) === JSON.stringify(configFile.configurations[i])){
      indexOfOld = i;
      oldConfigFound = true;
    }
  }

  if(!oldConfigFound){

    callback('Configuration not found');

  } else {

    for(var i = 0; i < configFile.configurations.length; i++){

      if(i != indexOfOld){

        if(JSON.stringify(newConfiguration) === JSON.stringify(configFile.configurations[i])){
          duplicate = true;
          message = 'Duplicate configuration of proposed changes found.';
          break;
        }

        if(configFile.configurations[i].name === newConfiguration.name){
          duplicate =  true;
          message = 'Proposed name field not unique';
          break;
        }

        if(configFile.configurations[i].hostname === newConfiguration.hostname){
          duplicate =  true;
          message = 'Proposed hostname field not unique';
          break;
        }
      }
    }

    if(duplicate){

      callback(message);

    } else if(JSON.stringify(oldConfiguration) === JSON.stringify(newConfiguration)){

      callback('No changes proposed');

    } else {

      try{

        fs.readFile(configFileName, function(err, data){

          configFile.configurations[indexOfOld] = newConfiguration;

          try{

            fs.writeFileSync(configFileName, JSON.stringify(configFile));
            callback('Configuration updated successfully');

          } catch(e){ callback(e.message); }

        });

      } catch(e){ callback(e.message); }
    }
  }
}

//This is a function for logging
//
//@param text = text to be logged
exports.logger = function(text){
  var msg = '\nLog Time: ' + apiToolBox.getCurrentTime() + ' : ' + text;
  fs.appendFileSync('./activityLog.txt', msg);
}

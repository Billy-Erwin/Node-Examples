//Module handles GETing configurations
//@author: Billy Erwin, 7-14-2015

var apiToolBox = require('./apiToolBox');
var apiDataAccess = require('./apiDataAccess');

//Get configurations - GET
module.exports = function(req, resp){

  if(req.method === 'GET'){

    req.on('data', function(data){

      var options = JSON.parse(data);

      if(apiToolBox.validateOptions(options)){

        var field = options.sortBy;
        var pageNumber = options.pageNumber;
        var resultsPerPage = options.resultsPerPage;
        var showAll = options.showAll;

        apiToolBox.sortBy(field, function(body){

          if(showAll){

            apiDataAccess.logger('Success getConfiguration');
            resp.writeHead(200, {'Content-Type': 'application/json'});
            resp.end(JSON.stringify(body));

          } else{

            apiToolBox.paginate(body, pageNumber, resultsPerPage, function(configList){

              apiDataAccess.logger('Success getConfiguration');
              resp.writeHead(200, {'Content-Type': 'application/json'});
              resp.end(JSON.stringify(configList));

            });
          }
        });
      } else {

        var message = {
          msg: 'Incorrect Option Data for ' + req.url
        }

        apiDataAccess.logger(JSON.stringify(message));
        resp.writeHead(400, {'Content-Type': 'application/json'});
        resp.end(JSON.stringify(message));

      }


    });

  } else {

    var message = {
      msg: 'Incorrect HTTP Method.  Use a GET for ' + req.url
    }

    apiDataAccess.logger(JSON.stringify(message));
    resp.writeHead(405, {'Content-Type': 'application/json'});
    resp.end(JSON.stringify(message));
  }
}

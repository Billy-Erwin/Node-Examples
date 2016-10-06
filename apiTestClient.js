var http = require('http');
var myToken = '';
var apiDataAccess = require('./apiDataAccess');

testScript();

function testScript(){

  authenticationCall(function(){
    // console.log('authenticationCall ')
    getConfigCall(function(){
      // console.log('getConfigCall1');
      createConfigCall(function(){
        // console.log('logOutCall');
        deleteConfigCall(function(){

          updateConfigCall(function(){

            logOutCall(function(){

              getConfigCall(function(){

                console.log('....ending script..')

              });
            });
          });
        });
      });
    });
  });
}

function authenticationCall(callback){

  var userData = JSON.stringify({
    username : 'Billy',
    password : 'asdf1234'
  })

  var authInfo = new Buffer(userData).toString('base64');

  var options = {

    hostname: 'localhost',
    port: 8080,
    path: 'https://localhost/api/login',
    method: 'POST',

    headers: {
              'Content-Type': 'application/JSON',
              'Authorization': authInfo
    }

  };

  var req = http.request(options, function(res) {

    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');

    // myToken = JSON.parse(JSON.stringify(res.headers)).token;
    myToken = res.headers.token;
    res.on('data', function (chunk) {

      console.log('BODY: ' + chunk);

    });
    res.on('end', function(){
      callback(res.headers.token);
    });
  });

  req.on('error', function(e) {

    console.log('problem with request: ' + e.message);

  });

  // console.log("header token " + myToken);
  // write data to request body
  // req.write(postData);
  req.end();
}

function getConfigCall(callback){

  var body = JSON.stringify({
    sortBy: 'hostname',
    pageNumber: 2,
    resultsPerPage: 5,
    showAll : false
  });

  var options = {
    hostname: 'localhost',
    port: 8080,
    path: 'https://localhost/api/getConfigurations',
    method: 'GET',

    headers: {
        'Content-Type': 'application/JSON',
        'Content-Length': body.length,
        'token': myToken
    }
  };

  var req = http.request(options, function(resp){
    // resp.setEncoding('utf8');
    // myToken = resp.headers.token;
    resp.on('data', function(chunk){
      console.log("body of resp : " + chunk.toString());
    })

    // resp.on('end', function(){
    //   callback(resp.headers.token);
    // });
    // resp.on('end', createConfigCall);
    resp.on('end', callback);

  })

  req.on('error', function(e){
    console.log('Problem With Request ' + e.message);
  })


  req.write(body); // this will be sorting and paginating
  req.end();
}

function createConfigCall(callback){

  var newConfig = JSON.stringify({
    name: 'name2',
    hostname: 'hostname2',
    port: 2222,
    username: 'user1'
  });
  // var newConfig = JSON.stringify({
  //   name: 'billy',
  //   hostname: 'billy.com',
  //   port: 1369,
  //   username: 'berwin'
  // });

  var options = {
    hostname: 'localhost',
    port: 8080,
    path: 'https://localhost/api/createConfiguration',
    method: 'POST',

    headers: {
        'Content-Type': 'application/JSON',
        'Content-Length': newConfig.length,
        'token': myToken
    }
  };

  var req = http.request(options, function(resp){
    resp.on('data', function(chunk){
      console.log("body of resp : " + chunk.toString());
    });

    // resp.on('end', deleteConfigCall);
      resp.on('end', callback);

  });

  req.on('error', function(e){
    console.log('Problem With Request ' + e.message);
  })

  req.write(newConfig);
  req.end();

}

function deleteConfigCall(callback){

  var newConfig = JSON.stringify({
    name: 'billy',
    hostname: 'billy.com',
    port: 1369,
    username: 'berwin'
  });
  // var newConfig = JSON.stringify({
  //   name: 'name2',
  //   hostname: 'hostname2',
  //   port: 2222,
  //   username: 'user1'
  // });

  var options = {
    hostname: 'localhost',
    port: 8080,
    path: 'https://localhost/api/deleteConfiguration',
    method: 'DELETE',

    headers: {
        'Content-Type': 'application/JSON',
        'Content-Length': newConfig.length,
        'token': myToken
    }
  };

  var req = http.request(options, function(resp){
    resp.on('data', function(chunk){
      console.log("body of resp : " + chunk.toString());
    })

    // resp.on('end', updateConfigCall);
      resp.on('end', callback);

  })

  req.on('error', function(e){
    console.log('Problem With Request ' + e.message);
  })

  req.write(newConfig);
  req.end();

}

function updateConfigCall(callback){

  var configs = JSON.stringify({
    newConfig : {
      name: 'billy',
      hostname: 'billy.com',
      port: 1369,
      username: 'berwin'
    },
    oldConfig : {
      name: 'name2',
      hostname: 'hostname2',
      port: 2222,
      username: 'user1'
    }
  });

  var options2 = {
    hostname: 'localhost',
    port: 8080,
    path: 'https://localhost/api/updateConfiguration',
    method: 'PUT',

    headers: {
        'Content-Type': 'application/JSON',
        'Content-Length': configs.length,
        'token': myToken
    }
  };

  var req2 = http.request(options2, function(resp){
    resp.on('data', function(chunk){
      console.log("body of resp : " + chunk.toString());
    })

    // resp.on('end', logOutCall);
      resp.on('end', callback);

  })

  req2.on('error', function(e){
    console.log('Problem With Request ' + e.message);
  })

  req2.write(configs);
  req2.end();

}

function logOutCall(callback){

  var options = {
    hostname: 'localhost',
    port: 8080,
    path: 'https://localhost/api/logout',
    method: 'POST',

    headers: {
        'Content-Type': 'application/JSON',
        'token': myToken
    }
  };

  var req = http.request(options, function(resp){

    // myToken = resp.headers.token;
    resp.on('data', function(chunk){
      console.log("body of resp : " + chunk.toString());
    })

    // resp.on('end', function(){
    //   callback(resp.headers.token);
    // });
    resp.on('end', callback);

  })

  req.on('error', function(e){
    console.log('Problem With Request ' + e.message);
  })

  req.end();

}

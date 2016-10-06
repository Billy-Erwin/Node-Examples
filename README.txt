Server setup to run on localhost:8080

routes include:
localhost:8080/api/login  			-HTTP POST only
localhost:8080/api/getConfigurations 		-HTTP GET only
localhost:8080/api/updateConfiguration		-HTTP PUT only
localhost:8080/api/createConfiguration		-HTTP POST only
localhost:8080/api/deleteConfiguration		-HTTP DELETE only
localhost:8080/api/logout			-HTTP POST only

The /api/login URL expects a JSON object in the 'authorization' header with username and password 
information encoded in base64.  Must use HTTP POST
 
 var userData = JSON.stringify({
    username : 'Billy',
    password : 'asdf1234'
  })

var authInfo = new Buffer(userData).toString('base64');

Valid login credentials can be found in the user.json file.  login will return a token in the 'token' 
header.  The token has a TimeToLive of 5 minutes.  if a request is made within one minute of 
expiration, a new token will be issued.   Once a token expires, the user will be required to resubmit 
their username, password credentials to the login URL.

Every request requires a valid token to be passed in via the 'token' header.  Tokens will be returned 
in every response in the 'token'  header, with the exception of the /api/logout URL

The /api/getConfigurations URL expects json object in the body of the request containing pagination 
and sortBy information.  Must use HTTP GET

 var body = JSON.stringify({
    sortBy: 'hostname', //string indicate the field you would like to sort by (hostname, name, port,
			//username)
    pageNumber: 5,   	//integer representation of page number for pagination
    resultsPerPage: 3,	//integer indicating how many results per page
    showAll : false	//Boolean to bypass pagination and receive all configuration records in one 				
			//page
  });

The return object will be a JSON formatted object with the data range requested, in the sort order 
indicated. 

The /api/updateConfiguration URL expects a JSON containing the old config, and the config specs to 
be changed to, in the body of the request.  Must use HTTP PUT

  var configs = JSON.stringify({
    newConfig : {
      name: 'billy', 		//String, must be unique to configurations file
      hostname: 'billy.com',	//String, must be unique to configurations file
      port: 1369,		//integer
      username: 'berwin'	//String
    },
    oldConfig : {			
      name: 'name2',		//String, must be unique to configurations file
      hostname: 'hostname2',	//String, must be unique to configurations file
      port: 2222,		//integer
      username: 'user1'		//String
    }
  });

Returns success/error message

The /api/createConfiguration URL expects a JSON object int the body or the request representing the 
new configuration:

  var newConfig = JSON.stringify({
    name: 'billy',		//String, must be unique to configurations file
    hostname: 'billy.com',	//String, must be unique to configurations file
    port: 1369,			//integer
    username: 'berwin'		//String
  });

Returns success/error message

The / api/deleteConfiguration URL expects a JSON object representing the configuration to be deleted:

  var newConfig = JSON.stringify({
    name: 'billy',		//String
    hostname: 'billy.com',	//String
    port: 1369,			//integer
    username: 'berwin'		//String
  });

Returns success/error message

The /api/logout URL takes the token from the header and places it in a blacklist.  A routine runs 
on incoming requests that goes through the blacklist and removes expired tokens in an effort to 
keep the list size at a minimum.  Must use HTTP POST.

Returns logout message




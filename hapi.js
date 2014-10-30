var bl = require('bl');
var https = require('https');
var Hapi=require('hapi');
var path = require('path');
var url = "http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json";								// create our app with express

var server = Hapi.createServer('localhost',8080);


server.route({
	path:'/api/youtube',
	method:'GET',
	handler: response

});

server.start();
		


function response (request, reply) {
//get the json data from youtube api
console.log(request.query.url);
	get_json(request.query.url,function(jsondata){
			reply(jsondata); 
		});
	
	};


//Get json from youtube
function get_json(url,callback){
	https.get(url, function(resForhttp) {
		//change the node buffer to string 
  		resForhttp.setEncoding('utf8');
  		//use 'bl' module to help us collect the entire stream of data therefore we don't need to collect every chunk and add them all ourselves
  		resForhttp.pipe(bl(function(err,data){
			var stringFromServer = data.toString();
			if (err)
				res.send(err);
			
			callback(JSON.parse(stringFromServer));
  		}));

	}).on('error', function(e) {
  		console.log("Got error: " + e.message);
		});
}




console.log("App listening on port 8080");
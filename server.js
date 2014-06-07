/*
 * Imports 
 */
var http = require("http"); //Import http to server files
var fs = require("fs"); //Import tools for manipulating filesystem
var url = require("url"); //Parsing urls
var mime = require('mime'); //Parsing MIME-Types

var ports = {
	webserver: 81,
	websocket: 2806
};

function startServers(){
	http.createServer(function(request, response){
		var path = url.parse(request.url).pathname;
		if(path == "/"){
			path = "client/index.html";
		}
		else{
			path = "client/" + path;
		}
		fs.readFile(path, function(err, data){
			if(err){
				response.writeHeader(404, {
					"Content-Type": "text/html"
				});
				response.end("<html><body><h1>Walk away!</h1><p>Nothing to see here...</p></body><html>");
			}
			else{
				response.writeHeader(200, {
					"Content-Type": mime.lookup(path)
				});
				response.end(data);
			}
		});
	}).listen(ports.webserver);
};

fs.writeFile("client/port.js", "var port = " + ports.websocket + ";", function(err){
	if(err) {
		console.error("Portfile could not be written. Not starting servers.");
	}
	else{
		startServers();
	}
	
});

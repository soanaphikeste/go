/*
 * Imports 
 */
var WebSocketServer = require('ws').Server;
var http = require("http"); //Import http to server files
var fs = require("fs"); //Import tools for manipulating filesystem
var url = require("url"); //Parsing urls
var mime = require('mime'); //Parsing MIME-Types
var Connection = require("./connection.js");
var Client = require("./client.js");
fs.readFile("config.json", function(err, data) {
	var config;
	if(err) {
		console.error("No configfile found. Please run grunt.");
		return;
	}
	else {
		config = JSON.parse(data);
	}
	if(config === undefined 
	|| config.ports === undefined 
	|| config.ports.webserver === undefined 
	|| config.ports.websocket === undefined 
	|| config.webroot === undefined 
	|| config.webserver === undefined) {
		console.error("Configfile missing properties. Please delete or move file and run grunt to create default file.");
		return;
	}

	function startServers(){
		if(config.webserver) {
			http.createServer(function(request, response){
				var path = url.parse(request.url).pathname;
				if(path == "/"){
					path = config.webroot + "/index.html";
				}
				else{
					path = config.webroot + "/" + path;
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
				
			}).listen(config.ports.webserver);
			console.log("Webserver is listening on port " + config.ports.webserver);
		}
		
		this.clients = [];
		new WebSocketServer({
			host: "0.0.0.0", 
			port: config.ports.websocket
		}).on("connection", function(socket){
			var connection = new Connection(socket);
			clients.push(new Client(clients, connection));
			//console.log("Client connected!");
		});
		console.log("Websocketserver is listening on port " + config.ports.websocket);
	};

	fs.writeFile(config.webroot + "/port.js", "var port = " + config.ports.websocket + ";", function(err){
		if(err) {
			console.error("Portfile could not be written. Not starting servers.");
		}
		else{
			startServers();
		}
		
	});

	
});

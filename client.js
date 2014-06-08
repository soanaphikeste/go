var consonants = "BDFGHJKLMNPRSTUWZ";
var vocals = "AEIOU";
var idLen = 6;

var ServerGame = require("./servergame.js");

var Client = function(clients, connection){
	this.clients = clients;
	this.connection = connection;
	do{
		var name = this.makeName();
		var found = false;
		for(client in this.clients){
			if(clients[client].name == name){
				found = true;
				break;
			}
		}
		if(!found){
			this.name = name;
			break;
		}
	} while(true);
	
	this.connection.send("setName", this.name);
	
	this.connection.addListener("connectToPlayer", function(name){
		for(client in this.clients){
			if(clients[client].name == name){
				clients[client].sendMatchRequest(this);
			}
		}
	});
	
	this.connection.addListener("click", function(pos){
		if(this.game !== undefined){
			this.game.makeTurn(this, pos.y, pos.x);
		}
	});
};

Client.prototype = {
	makeName: function(){
		var id = "";
		var vocal = false;
		for(var i = 0; i < idLen; i++){
			if(vocal){
				id += vocals.charAt(parseInt(Math.random() * vocals.length));
			}
			else{
				id += consonants.charAt(parseInt(Math.random() * consonants.length));
			}
			vocal = !vocal;
		}
		return id;
	},
	
	sendMatchRequest: function(requester){
		this.connection.send("matchRequest", requester.name, function(accepted){
			if(accepted){
				this.game = new ServerGame({
					challenger: requester,
					opponent: this
				});
				requester.game = this.game;
				this.sendAcceptMatch();
				requester.sendAcceptMatch();
			}
			else{
				requester.sendDeclineMatch();
			}
		});
	},
	
	sendAcceptMatch: function(){
		this.connection.send("matchAccepted", null);
	},
	
	sendDeclineMatch: function(name){
		this.connection.send("matchDeclined", null);
	},
	
	nextTurn: function(name){
		this.connection.send("nextTurn", name);
	},
	
	sendTurn: function(row, col){
		this.connection.send("madeTurn", { row: row, col: col});
	}
};

module.exports = Client;

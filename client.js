var consonants = "BDFGHJKLMNPRSTWZ";
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
	
	var self = this;
	this.connection.addListener("connectToPlayer", function(name){
		var found = false;
		for(client in self.clients){
			if(clients[client].name == name){
				found = true;
				if(clients[client] == self){
					self.sendDeclineMatch("Man kann sich nicht selbst herausfordern");
					break;
				}
				clients[client].sendMatchRequest(self);
				break;
			}
		}
		if(!found){
			self.sendDeclineMatch("Der Spieler ist nicht online");
		}
	});
	
	this.connection.addListener("click", function(pos){
		if(self.game !== undefined){
			self.game.makeTurn(self, pos.y, pos.x);
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
		var self = this;
		this.connection.send("matchRequest", requester.name, function(accepted){
			if(accepted){
				self.game = new ServerGame({
					challenger: requester,
					opponent: self
				});
				requester.game = self.game;
				self.sendAcceptMatch();
				requester.sendAcceptMatch();
			}
			else{
				requester.sendDeclineMatch("Der andere Spieler hat die Herausforderung abgelehnt");
			}
		});
	},
	
	sendAcceptMatch: function(){
		this.connection.send("matchAccepted", null);
	},
	
	sendDeclineMatch: function(reason){
		this.connection.send("matchDeclined", reason);
	},
	
	nextTurn: function(name){
		this.connection.send("nextTurn", name);
	},
	
	sendTurn: function(row, col){
		this.connection.send("madeTurn", { row: row, col: col});
	}
};

module.exports = Client;

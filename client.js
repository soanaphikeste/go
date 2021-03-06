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
			self.game.makeTurn(self, pos.row, pos.col);
		}
	});
	
	this.connection.addCloseListener(function() {
		self.clients.splice(self.clients.indexOf(this), 1);
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
				self.sendAcceptMatch(requester.name);
				requester.sendAcceptMatch(requester.name);
				self.game = new ServerGame({
					challenger: requester,
					opponent: self
				});
				requester.game = self.game;
			}
			else{
				requester.sendDeclineMatch("Der andere Spieler hat die Herausforderung abgelehnt");
			}
		});
	},
	
	sendAcceptMatch: function(challenger){
		var self = this;
		this.connection.send("matchAccepted", challenger, function(){
			self.game.ready(self);
		});
	},
	
	sendDeclineMatch: function(reason){
		this.connection.send("matchDeclined", reason);
	},
	
	nextTurn: function(name){
		this.connection.send("nextTurn", name);
	},
	
	sendTurn: function(row, col){
		this.connection.send("madeTurn", { row: row, col: col});
	},
	
	sendInvalidTurn: function(row, col, reason){
		this.connection.send("invalidTurn", {row: row, col: col, reason: reason});
	},
	
	sendRemoveToken: function(tokens, challenger_prisoners){
		this.connection.send("removeToken", {
			tokens: tokens,
			challenger_prisoners: challenger_prisoners
		});
	},
	
	sendColor : function(color){
		this.connection.send("color", color);
	},
	
	mouseListen : function(other) {
		var self = this;
		this.connection.addListener("moveCursor", function(obj) {
			if(self.game === undefined || other === undefined) return;
			other.connection.send("cursorMove", {
				x: obj.x,
				y: obj.y
			});
		});
	},
	
	closeListen : function(other) {
		var self = this;
		console.log(this.name + " is listening for closing socket and will notify " + other.name + " then.");
		this.connection.addCloseListener(function() {
			console.log("Client closed his window :'-(");
			if(self.game === undefined || other === undefined) return;
			console.log("Ending game of other player");
			other.endGame("Dein Gegner hat das Spiel verlassen!");
			self.endGame();
			console.log("Everything terminated");
		});
	},
	
	endGame : function(message) {
		this.game.terminate();
		this.game = undefined;
		if(message !== undefined) {
			this.connection.send("end", message);
		}
	}
};

module.exports = Client;

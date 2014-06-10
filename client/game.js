/**
 * game.js
 * 
 * This class represents the logic part of the game. (It's board, tokens
 * and players)
 * 
 * Distributed 2014 by Soana (Andra Ruebsteck) under the terms of GPL.
 */
var white = true;
var black = false;

function startGame(myName){
	var canvas = $("canvas");
	var cursor = new Cursor({ 
		cursorColor: "#7777F6", 
		tokenColor: "#8989E0", 
		cursorColorDeactivated: "#A6A6A6"
	}, canvas[0]);
	var enemyCursor = new Cursor({ 
		cursorColor: "#7777F6", 
		tokenColor: "#8989E0", 
		cursorColorDeactivated: "#A6A6A6"
	});
	Game.init(myName);
	Graphics.init({
		canvas: canvas,
		margin: {
			inner: 10,
			outer: 20,
			token: 2
		},
		letterSize: 20
	});
	Graphics.addCursor(cursor);
	Graphics.addCursor(enemyCursor);
}

function challenge(name){
	if(opponent !== undefined){
		showPopUp("Man kann nur eine Person zur Zeit herausfordern");
		return;
	}
	opponent = name;
	Connection.send("connectToPlayer", name);
}

var Game = {
	
	init: function(myName){
		var self = this;
		this.myName = myName;	
		for(this.board = []; this.board.length < 19; this.board.push(Array(19)));
		this.currentColor = black;
		console.log("Game started");
		Connection.addMessageListener("invalidTurn", function(obj) {
			showPopUp("Ungültiger Zug: " + obj.reason);
		});
		Connection.addMessageListener("removeToken", function(data){
			for(var token in data.tokens){
				self.remove(data.tokens[token].row, data.tokens[token].col);
			}
			
			var who;
			if(data.challenger_prisoners){
				console.log("Challenger captured " + data.tokens.length + " - " + data.challenger_prisoners);
				who = $("#prisoners_challenger");
			}
			else{
				console.log("Opponent captured " + data.tokens.length + " - " + data.challenger_prisoners);
				who = $("#prisoners_opponent");
			}
			var howMany = parseInt(who.html())+data.tokens.length
			who.html(howMany);
		});
		Connection.addMessageListener("madeTurn", function(pos){
			self.place(pos.row, pos.col);
		});
		Connection.addMessageListener("end", function(message){
			showPopUp(message, function() {
				
			});
		});
		Connection.addMessageListener("color", function(color){
			self.ownColor = color;
		});
	},
	
	place: function(row, col){
		if(this.board[row][col] !== undefined){
			console.error("Invalid move! Cannot place at: (" + col + "|" + row + ")");
			return;
		}
		this.board[row][col] = this.currentColor;
		this.currentColor = !this.currentColor;
	},
	
	remove: function(row, col){
		this.board[row][col] = undefined;
	},
	
	isMyTurn: function() {
		return this.myName == this.currentPlayer;
	}
};


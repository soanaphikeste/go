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
	var cursor = new Cursor(canvas[0], { cursorColor: "#6060D5", tokenColor: "#8989E0", cursorColorDeactivated: "grey"});
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
		Connection.addMessageListener("removeToken", function(tokens){
			for(token in tokens){
				self.remove(tokens[token].row, tokens[token].col);
			}
		});
		Connection.addMessageListener("madeTurn", function(pos){
			self.place(pos.row, pos.col);
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


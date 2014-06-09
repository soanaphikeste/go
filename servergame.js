var challenger = true;
var opponent = false;


function pushEverything(arr1, arr2) {
	for(var i = 0; i < arr2.length; i++) {
		arr1.push(arr2[i]);
	}
}
	
var ServerGame = function(members){
	if(members === undefined || members.challenger === undefined || members.opponent === undefined){
		console.error("Could not create Servergame - missing opponents");
		return;
	}
	this.board = this.createEmptyBoard();
	
	this.challenger = members.challenger;
	this.opponent = members.opponent;
	this.challenger.mouseListen(this.opponent);
	this.opponent.mouseListen(this.challenger);
	this.challengerTurn = false;
	this.challenger.closeListen(this.opponent);
	this.opponent.closeListen(this.challenger);
};

ServerGame.prototype = {
	nextTurn: function(){
		if(this.terminated) return;
		var name;
		if(this.challengerTurn){
			 name = this.challenger.name;
		}
		else{
			name = this.opponent.name;
		}
		this.challenger.nextTurn(name);
		this.opponent.nextTurn(name);
	},
	
	makeTurn: function(player, row, col){
		if(this.terminated) return;
		if((player == this.challenger && this.challengerTurn) || (player == this.opponent && !this.challengerTurn)){
			if(this.turnValid(player, row, col)){
				this.board[row][col] = this.challengerTurn;
				var removed = this.removeTokens(player == this.challenger, row, col);//retrieve array of all tokens to remove for this player starting at row|col
				if(removed.length != 0){
					this.challenger.sendRemoveToken(removed, player == this.challenger);
					this.opponent.sendRemoveToken(removed, player == this.challenger);
				}
				this.challenger.sendTurn(row, col);
				this.opponent.sendTurn(row, col);
				this.challengerTurn = !this.challengerTurn;
				this.nextTurn();
			}
			else if(this.challengerTurn){ 
				this.challenger.sendInvalidTurn(row, col, "Invalid turn");
			}
			else{
				this.opponent.sendInvalidTurn(row, col, "Invalid turn");
			}
		}
	},
	
	turnValid: function(player, row, col){
		if(this.board[row][col] !== undefined) return false;
		var color = player == this.challenger;
		this.board[row][col] = color;
		if(this.hasFreedom(color, row, col, this.createEmptyBoard())){
			return true;
		}
		else{
			color = !color;
			visited = this.createEmptyBoard();
			var valid = false;
			var self = this;
			this.iterateOverNeighbours(row, col, function(p) {
				valid = valid || self.inBoard(p.row, p.col) && !self.hasFreedom(color, p.row, p.col, self.createEmptyBoard());
			});
			
			if(!valid){
				this.board[row][col] = undefined;
			}
			return valid;
		}
	},
	
	hasFreedom: function(color, row, col, visited){
		visited[row][col] = true;
		var freedom = false;
		var self = this;
		this.iterateOverNeighbours(row, col, function(p) {
			if(self.inBoard(p.row, p.col) && !visited[p.row][p.col]){//See if the color isn't our color (So it's either free or enemy)
				visited[p.row][p.col] = true;
				freedom |= self.board[p.row][p.col] === undefined //Free field
							|| (self.board[p.row][p.col] == color && self.hasFreedom(color, p.row, p.col, visited)); //Or neighbouring field is ours and has itself a free field neighbouring (recursivly)
			}
		});
		return freedom;
	},
	
	inBoard: function(row, col){
		return (row%19-1 >= 0 && col%19-1 >= 0);
	},
	
	iterateOverNeighbours : function(row, col, func) {
		var arr;
		for(var pos in arr = [{row: row+1, col: col},{row: row-1, col: col},{row: row, col: col+1},{row: row, col: col-1}]) {
			func(arr[pos]);
		}
	},
	
	removeTokens: function(color, row, col){
		console.log("removeTokens");
		var removed = [];//Start with empty array
		var self = this;
		this.iterateOverNeighbours(row, col, function(p) {
			if(self.inBoard(p.row, p.col) && self.board[p.row][p.col] !== undefined && self.board[p.row][p.col] != color && !self.hasFreedom(!color, p.row, p.col, self.createEmptyBoard())){//See if the color isn't our color (So it's either free or enemy)
				pushEverything(removed, self.helpRemoveTokens(!color, p.row, p.col));//Start recursion for this token
			}
		});
		return removed;
	},
	
	helpRemoveTokens: function(color, row, col){
		console.log("helpRemoveTokens");
		var removed = [];
		removed.push({row: row, col: col});
		this.board[row][col] = undefined;
		var self = this;
		this.iterateOverNeighbours(row, col, function(p) {
			if(self.inBoard(p.row, p.col) && self.board[p.row][p.col] == color){
				pushEverything(removed, self.helpRemoveTokens(color, p.row, p.col));//Continue recursion for this token
			}
		});
		return removed;
	},
	
	ready: function(player){
		console.log(player.name + " is now ready");
		player._game_ready = true;
		if(this.challenger._game_ready && this.opponent._game_ready){
			this.challenger.sendColor(challenger);
			this.opponent.sendColor(opponent);
			this.nextTurn();
		}
	},
	
	createEmptyBoard: function() {
		var board;
		for(board = []; board.length < 19; board.push(Array(19)));
		return board;
	},
	
	terminate : function() {
		this.terminated = true;
		this.opponent = undefined; //Give Garbagecollector hints
		this.challenger = undefined;
		this.board = undefined;
	}
};

module.exports = ServerGame;

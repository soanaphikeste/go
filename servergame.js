var challenger = true;
var opponent = false;

var ServerGame = function(members){
	if(members === undefined || members.challenger === undefined || members.opponent === undefined){
		console.error("Could not create Servergame - missing opponents");
		return;
	}
	for(this.board = []; this.board.length < 19; this.board.push(Array(19)));
	
	this.challenger = members.challenger;
	this.opponent = members.opponent;
	
	this.challengerTurn = false;
};

ServerGame.prototype = {
	nextTurn: function(){
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
		if((player == this.challenger && this.challengerTurn) || (player == this.opponent && !this.challengerTurn)){
			if(this.turnValid(player, row, col)){
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
		//TODO: Zug ueberpruefen
		return true;
	},
	
	ready: function(player){
		console.log(player.name + " is now ready");
		player._game_ready = true;
		if(this.challenger._game_ready && this.opponent._game_ready){
			this.nextTurn();
		}
	}
};

module.exports = ServerGame;

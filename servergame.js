var ServerGame = function(members){
	if(members === undefined || members.challenger === undefined || members.opponent === undefined){
		console.error("Could not create Servergame - missing opponents");
		return;
	}
	
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
			this.challenger.sendTurn(row, col);
			this.opponent.sendTurn(row, col);
		}
	}
};

module.exports = ServerGame;

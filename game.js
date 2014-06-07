var white = true;
var black = false;

var Game = {
	
	init: function(){	
		for(this.board = []; this.board.length < 19; this.board.push(Array(19)));
		this.board[7][7] = white;
		this.board[7][0] = white;
		this.board[7][10] = white;
		this.board[0][0] = white;
		this.board[18][18] = white;
		
		this.board[8][7] = black;
		this.board[3][0] = black;
		this.board[2][10] = black;
		this.board[18][0] = black;
		this.board[0][18] = black;
		console.log(this.board[7][7]);
		console.log("Game started");
	}
};


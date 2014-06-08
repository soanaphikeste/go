var white = true;
var black = false;

function startGame(){
	var canvas = $('<canvas width="1024" height="1024"></canvas>').appendTo("body");
	var cursor = new Cursor(canvas[0], { cursorColor: "#6060D5", tokenColor: "#8989E0"});
	Game.init();
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
	},
	
	place: function(row, col, color){
		if(color !== white && color !== black){
			console.error("Invalid color: " + color);
			return;
		}
		if(this.board[row, col] !== undefined){
			console.error("Invalid move! Cannot place at: (" + col + "|" + row + ")");
			return;
		}
		this.board[row][col] = color;
	}
};


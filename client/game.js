var white = true;
var black = false;

function startGame(){
	var canvas = $("canvas");
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

function challenge(name){
	if(opponent !== undefined){
		showPopUp("Man kann nur eine Person zur Zeit herausfordern");
		return;
	}
	opponent = name;
	Connection.send("connectToPlayer", name);
}

var Game = {
	
	init: function(){	
		for(this.board = []; this.board.length < 19; this.board.push(Array(19)));
		/*this.board[7][7] = white;
		this.board[7][0] = white;
		this.board[7][10] = white;
		this.board[0][0] = white;
		this.board[18][18] = white;
		
		this.board[8][7] = black;
		this.board[3][0] = black;
		this.board[2][10] = black;
		this.board[18][0] = black;
		this.board[0][18] = black;
		console.log(this.board[7][7]);*/
		this.color = black;
		console.log("Game started");
	},
	
	place: function(row, col){
		if(this.board[row][col] !== undefined){
			console.error("Invalid move! Cannot place at: (" + col + "|" + row + ")");
			return;
		}
		this.board[row][col] = this.color;
		this.color = !this.color;
	},
	
	remove: function(row, col){
		this.board[row][col] = undefined;
	}
};


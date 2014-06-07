var Graphics = {
	init: function(args){
		if(args.game === undefined){
			console.error("Game undefined");
			return;
		}
		this.game = args.game;
		this.margin = {
			outer: args.margin === undefined || args.margin.outer === undefined ? 20: args.margin.outer,
			inner: args.margin === undefined || args.margin.inner === undefined ? 10: args.margin.inner,
			token: args.margin === undefined || args.margin.token === undefined ? 2: args.margin.token,
			letters: args.letterSize === undefined ? 20: args.letterSize
		};
		this.lineStyle = {
			innerLine: 2,
			outerLine: 10
		};
		this.canvas = args.canvas === undefined ? $("canvas"): args.canvas;
		this.ctx = this.canvas[0].getContext("2d");
		this.size = {
			width: Graphics.canvas.width(),
			height: Graphics.canvas.height()
		};
		this.size.min = this.size.width < this.size.height ? this.size.width: this.size.height;
		this.x = 0;
		console.log("Graphics started");
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		this.setupBoard();
		this.draw();
	},
	
	draw: function(){
		this.ctx.putImageData(this.board, 0,0);//, this.size.min, this.size.min);
		/*this.ctx.clearRect(0,0, this.size.width, this.size.height);
		this.ctx.fillStyle = "red";
		this.ctx.beginPath();
		this.ctx.rect(50 + this.x++*5,50, 100, 100);
		this.ctx.fill();*/
		this.drawTokens();
		window.requestAnimationFrame(function(){
			Graphics.draw();
		});
	},
	
	setupBoard: function(){
		this.ctx.strokeStyle = "#5E401E";
		this.ctx.fillStyle = "#E7D3A7";
		this.ctx.fillRect(0,0, this.size.min, this.size.min);
		
		this.ctx.fillStyle = this.ctx.strokeStyle;
		this.ctx.lineWidth = this.lineStyle.innerLine;
		this.ctx.font = "bold " + (this.margin.letters*3/4) + "px Arial";
		this.ctx.textAlign = "center";
		var allMargin = this.margin.outer + this.lineStyle.outerLine + this.margin.letters + this.margin.inner;
		var fieldWidth = (this.size.min - 2* allMargin) / 19;
		allMargin += fieldWidth/2;
		//console.log("min:" , this.size.min , ", allMargin: ", allMargin, ", fieldWidth: ", fieldWidth);
		var A = "A".charCodeAt(0);
		var I = "I".charCodeAt(0);
		for(var i = 0, j = 0; i < 19; i++, j++){
			//Horizontale Linien
			this.ctx.beginPath();
			this.ctx.moveTo(allMargin, allMargin + i * fieldWidth);
			this.ctx.lineTo(this.size.min - allMargin, allMargin + i * fieldWidth);
			this.ctx.stroke();
			
			this.ctx.fillText(19-i, allMargin - this.margin.letters*3/4 - fieldWidth/2, allMargin + i* fieldWidth + this.margin.letters*1/4);
			this.ctx.fillText(19-i, this.size.min - (allMargin - this.margin.letters*3/4 - fieldWidth/2), allMargin + i* fieldWidth + this.margin.letters*1/4);
			
			//Vertikale Linien
			this.ctx.beginPath();
			this.ctx.moveTo(allMargin + i * fieldWidth, allMargin);
			this.ctx.lineTo(allMargin + i * fieldWidth, this.size.min - allMargin);
			this.ctx.stroke();
			
			if(I == A+j){
				j++;
			}
			this.ctx.fillText(String.fromCharCode(A + j), allMargin + i* fieldWidth, allMargin - this.margin.inner/2 - fieldWidth/2);
			this.ctx.fillText(String.fromCharCode(A + j), allMargin + i* fieldWidth, this.size.min - (allMargin - this.margin.letters/2 - this.margin.inner/2 - fieldWidth/2));
		}
		
		for(var i = 3; i < 19; i += 6){
			for(var j = 3; j < 19; j += 6){
				this.ctx.beginPath();
				this.ctx.arc(allMargin + i * fieldWidth, allMargin + j * fieldWidth, fieldWidth/4, 0, Math.PI*2);
				this.ctx.fill();
			}
		}
		
		this.ctx.lineWidth = this.lineStyle.outerLine;
		this.ctx.strokeRect(this.margin.outer, this.margin.outer, this.size.min - 2*this.margin.outer, this.size.min - 2*this.margin.outer);
		
		this.board = this.ctx.getImageData(0,0, this.size.min, this.size.min);
	},
	
	drawTokens: function() {
		for(var i = 0; i < Game.board.length; i++){
			for(var j = 0; j < Game.board[0].length; j++){
				if(Game.board[i][j] !== undefined){
					this.drawToken(j, i, Game.board[i][j] == white ? "#FFFFFF": "#000000");
				}
			}
		}
	},
	
	drawToken: function(row, col, color){
		var allMargin = this.margin.outer + this.lineStyle.outerLine + this.margin.letters + this.margin.inner;
		var fieldWidth = (this.size.min - 2* allMargin) / 19;
		allMargin += fieldWidth/2;
		
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.arc(allMargin + row * fieldWidth, allMargin + col * fieldWidth, fieldWidth/2 - this.margin.token, 0, 2*Math.PI);
		this.ctx.fill();
	}
};

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
			letters: 15
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
		this.draw();
	},
	
	draw: function(){
		this.drawBoard();
		/*this.ctx.clearRect(0,0, this.size.width, this.size.height);
		this.ctx.fillStyle = "red";
		this.ctx.beginPath();
		this.ctx.rect(50 + this.x++*5,50, 100, 100);
		this.ctx.fill();*/
		window.requestAnimationFrame(function(){
			Graphics.draw();
		});
	},
	
	drawBoard: function(){
		this.ctx.strokeStyle = "#5E401E";
		this.ctx.fillStyle = "#E7D3A7";
		this.ctx.fillRect(0,0, this.size.min, this.size.min);
		
		this.ctx.fillStyle = this.ctx.strokeStyle;
		this.ctx.lineWidth = this.lineStyle.innerLine;
		this.ctx.font = "bold " + this.margin.letters + "px Arial";
		this.ctx.textAlign = "center";
		var allMargin = this.margin.outer + this.lineStyle.outerLine + this.margin.letters + this.margin.inner;
		var fieldWidth = (this.size.min - 2* allMargin) / 18;
		//console.log("min:" , this.size.min , ", allMargin: ", allMargin, ", fieldWidth: ", fieldWidth);
		var A = "A".charCodeAt(0);
		var I = "I".charCodeAt(0);
		for(var i = 0, j = 0; i < 19; i++, j++){
			//Horizontale Linien
			this.ctx.beginPath();
			this.ctx.moveTo(allMargin, allMargin + i * fieldWidth);
			this.ctx.lineTo(this.size.min - allMargin, allMargin + i * fieldWidth);
			this.ctx.stroke();
			
			this.ctx.fillText(19-i, allMargin - this.margin.letters - this.margin.inner/2, allMargin + i* fieldWidth + this.margin.letters/2);
			this.ctx.fillText(19-i, this.size.min - (allMargin - this.margin.letters - this.margin.inner/2), allMargin + i* fieldWidth + this.margin.letters/2);
			
			//Vertikale Linien
			this.ctx.beginPath();
			this.ctx.moveTo(allMargin + i * fieldWidth, allMargin);
			this.ctx.lineTo(allMargin + i * fieldWidth, this.size.min - allMargin);
			this.ctx.stroke();
			
			if(I == A+j){
				j++;
			}
			this.ctx.fillText(String.fromCharCode(A + j), allMargin + i* fieldWidth, allMargin - this.margin.letters/2 - this.margin.inner/2);
			this.ctx.fillText(String.fromCharCode(A + j), allMargin + i* fieldWidth, this.size.min - (allMargin - this.margin.letters - this.margin.inner/2));
			
		}
		
		this.ctx.lineWidth = this.lineStyle.outerLine;
		this.ctx.strokeRect(this.margin.outer, this.margin.outer, this.size.min - 2*this.margin.outer, this.size.min - 2*this.margin.outer);
		
	}
};

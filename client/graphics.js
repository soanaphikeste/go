/**
 * graphics.js
 * 
 * This file will handle the drawing of the board, 
 * tokens and the cursor.
 * 
 * Distributed 2014 by Soana (Andra Ruebsteck) under the terms of GPL.
 */
var Graphics = {
	init: function(args){
		this.cursors = [];
		this.margin = {
			outer: args.margin === undefined || args.margin.outer === undefined ? 20: args.margin.outer,
			inner: args.margin === undefined || args.margin.inner === undefined ? 10: args.margin.inner,
			token: args.margin === undefined || args.margin.token === undefined ? 2: args.margin.token,
			letters: args.letterSize === undefined ? 20: args.letterSize,
			all: 0
		};
		
		this.drawStyle = {
			innerLineWidth: 2,
			outerLineWidth: 10,
			backgroundColor: "#E7D3A7",
			lineColor: "#5E401E" 
		};
		
		this.canvas = args.canvas === undefined ? $("canvas")[0]: args.canvas;
		this.ctx = this.canvas[0].getContext("2d");
		this.size = {
			width: Graphics.canvas.width(),
			height: Graphics.canvas.height(),
			min: 0,
			field: 0
		};
		this.size.min = this.size.width < this.size.height ? this.size.width: this.size.height;
		
		this.margin.all = this.margin.outer + this.drawStyle.outerLineWidth + this.margin.letters + this.margin.inner;
		this.size.field = (this.size.min - 2* this.margin.all) / 19;
		this.margin.all += this.size.field/2;
		
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
		for(var i in this.cursors){
			this.cursors[i].draw();
		}
		window.requestAnimationFrame(function(){
			Graphics.draw();
		});
	},
	
	setupBoard: function(){
		this.ctx.strokeStyle = this.drawStyle.lineColor;
		this.ctx.fillStyle = this.drawStyle.backgroundColor;
		this.ctx.fillRect(0,0, this.size.min, this.size.min);
		
		this.ctx.fillStyle = this.ctx.strokeStyle;
		this.ctx.lineWidth = this.drawStyle.innerLineWidth;
		this.ctx.font = "bold " + (this.margin.letters*3/4) + "px Arial";
		this.ctx.textAlign = "center";
		
		//console.log("min:" , this.size.min , ", this.margin.all: ", this.margin.all, ", this.size.field: ", this.size.field);
		var A = "A".charCodeAt(0);
		var I = "I".charCodeAt(0);
		for(var i = 0, j = 0; i < 19; i++, j++){
			//Horizontale Linien
			this.ctx.beginPath();
			this.ctx.moveTo(this.margin.all, this.margin.all + i * this.size.field);
			this.ctx.lineTo(this.size.min - this.margin.all, this.margin.all + i * this.size.field);
			this.ctx.stroke();
			
			this.ctx.fillText(19-i, this.margin.all - this.margin.letters*3/4 - this.size.field/2, this.margin.all + i* this.size.field + this.margin.letters*1/4);
			this.ctx.fillText(19-i, this.size.min - (this.margin.all - this.margin.letters*3/4 - this.size.field/2), this.margin.all + i* this.size.field + this.margin.letters*1/4);
			
			//Vertikale Linien
			this.ctx.beginPath();
			this.ctx.moveTo(this.margin.all + i * this.size.field, this.margin.all);
			this.ctx.lineTo(this.margin.all + i * this.size.field, this.size.min - this.margin.all);
			this.ctx.stroke();
			
			if(I == A+j){
				j++;
			}
			this.ctx.fillText(String.fromCharCode(A + j), this.margin.all + i* this.size.field, this.margin.all - this.margin.inner/2 - this.size.field/2);
			this.ctx.fillText(String.fromCharCode(A + j), this.margin.all + i* this.size.field, this.size.min - (this.margin.all - this.margin.letters/2 - this.margin.inner/2 - this.size.field/2));
		}
		
		for(var i = 3; i < 19; i += 6){
			for(var j = 3; j < 19; j += 6){
				this.ctx.beginPath();
				this.ctx.arc(this.margin.all + i * this.size.field, this.margin.all + j * this.size.field, this.size.field/4, 0, Math.PI*2);
				this.ctx.fill();
			}
		}
		
		this.ctx.lineWidth = this.drawStyle.outerLineWidth;
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
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = this.drawStyle.lineColor;
		this.ctx.lineWidth = 1;
		this.ctx.beginPath();
		this.ctx.arc(this.margin.all + row * this.size.field, this.margin.all + col * this.size.field, this.size.field/2 - this.margin.token, 0, 2*Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
	},
	
	addCursor: function(cursor){
		this.cursors.push(cursor);
	}
};

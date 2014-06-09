/**
 * cursor.js
 * 
 * Displays the players cursor on the HTML5-canvas element and listens
 * to the players mouseevents.
 * 
 * Distributed 2014 by Soana (Andra Ruebsteck) under the terms of GPL.
 */
var Cursor = function(canvas, colors){
	this.pos = new vec(0,0);
	this.gap = degToRad(40);
	this.phi = 0;
	
	this.drawStyle = {
		lineWidth: 4,
		cursorColor: colors === undefined || colors.cursorColor === undefined ? "#6060D5": colors.cursorColor,
		cursorColorDeactivated: colors === undefined || colors.cursorColorDeactivated === undefined ? "grey": colors.cursorColorDeactivated,
		tokenColor: colors === undefined || colors.tokenColor === undefined ? "#8989E0": colors.tokenColor,
		wrongCursorColor: "#AE361F"
	};
	
	var self = this;
	canvas.addEventListener('mousemove', function(e) {
		var rect = canvas.getBoundingClientRect();
		self.pos = new vec(e.clientX - rect.left , e.clientY - rect.top);
		self.cell = self.pos.sub(new vec(Graphics.margin.all, Graphics.margin.all));
		if(self.cell.lessThan(new vec(-0.5,-0.5).mult(Graphics.size.field)) || self.cell.greaterThan(new vec(18.5,18.5).mult(Graphics.size.field))){
			self.cell = undefined;
		}
		else{
			self.cell = self.cell.mult(1/Graphics.size.field);
			self.cell = self.cell.round();
			if(self.cell.mult(Graphics.size.field).add(new vec(Graphics.margin.all, Graphics.margin.all)).sub(self.pos).length() > Graphics.size.field/2 - self.drawStyle.lineWidth){
				self.cell = undefined;
			}
			
		}
		//console.log(self.cell);
	});
	canvas.addEventListener("mouseup", function(evt){
		if(self.cell !== undefined){
			Connection.send("click", {row: self.cell.y, col: self.cell.x});
		}
	});
};

Cursor.prototype = {
	draw: function(){
		var ctx = Graphics.ctx;
		var fieldWidth = Graphics.size.field;
		var color = Game.isMyTurn() ? this.drawStyle.cursorColor : this.drawStyle.cursorColorDeactivated;
		
		if(this.cell !== undefined || !Game.isMyTurn()){//Either if it is not our turn or we cannot place here as there is already a token
			if(!Game.isMyTurn() || Game.board[this.cell.y][this.cell.x] !== undefined){
				color = Game.isMyTurn() ? this.drawStyle.wrongCursorColor : this.drawStyle.cursorColorDeactivated;
				/*
				 * \/
				 * /\
				 */
				ctx.strokeStyle = color;
				ctx.lineWidth = 5;
				var startPos1 = this.pos.sub(new vec(fieldWidth/4, fieldWidth/4));
				var endPos1 = this.pos.add(new vec(fieldWidth/4, fieldWidth/4));
				ctx.beginPath();
				ctx.moveTo(startPos1.x, startPos1.y);
				ctx.lineTo(endPos1.x, endPos1.y);
				ctx.stroke();
				
				var startPos2 = this.pos.add(new vec(fieldWidth/4, -fieldWidth/4));
				var endPos2 = this.pos.add(new vec(-fieldWidth/4, fieldWidth/4));
				ctx.beginPath();
				ctx.moveTo(startPos2.x, startPos2.y);
				ctx.lineTo(endPos2.x, endPos2.y);
				ctx.stroke();
			}
			else{
				/*
				 * Draw the ghost-token
				 */
				var color2;
				if(Game.ownColor == white) {
					color2 = "rgba(255, 255, 255, 0.55)";
				}
				else {
					color2 = "rgba(0, 0, 0, 0.4)";
				}
				Graphics.ctx.globalAlpha = 0.5;
				Graphics.drawToken(this.cell.x, this.cell.y, Game.ownColor);
				Graphics.ctx.globalAlpha = 1;
			}
		}
		
		/*
		 * Draw the cool turning rings
		 */
		ctx.strokeStyle = color;
		ctx.lineWidth = this.drawStyle.lineWidth;
		for(var i = -1; i <= 7; i+=2) {
			ctx.beginPath();
			ctx.arc(this.pos.x, this.pos.y, fieldWidth/2 + ctx.lineWidth/2, i*Math.PI/4 + this.gap/2 + this.phi, (i+2)*Math.PI/4 - this.gap/2 + this.phi);
			ctx.stroke();
		}
		
		
		
		if(Game.isMyTurn()) this.phi += degToRad(2);
	}
};

function degToRad(degree) {
	return (2*Math.PI)/360 * degree;
}

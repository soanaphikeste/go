var Cursor = function(canvas, colors){
	this.pos = new vec(0,0);
	this.gap = degToRad(40);
	this.phi = 0;
	
	this.drawStyle = {
		lineWidth: 4,
		cursorColor: colors === undefined || colors.cursorColor === undefined ? "#6060D5": colors.cursorColor,
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
};

Cursor.prototype = {
	draw: function(){
		var ctx = Graphics.ctx;
		var fieldWidth = Graphics.size.field;
		var color = this.drawStyle.cursorColor;
		
		if(this.cell !== undefined){
			if(Game.board[this.cell.y][this.cell.x] !== undefined){
				color = this.drawStyle.wrongCursorColor;
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
				Graphics.drawToken(this.cell.x, this.cell.y, this.drawStyle.tokenColor);
			}
		}
		
		ctx.strokeStyle = color;
		ctx.lineWidth = this.drawStyle.lineWidth;
		
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, fieldWidth/2 + ctx.lineWidth/2, -Math.PI/4 + this.gap/2 + this.phi, Math.PI/4 - this.gap/2 + this.phi);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, fieldWidth/2 + ctx.lineWidth/2, Math.PI/4 + this.gap/2 + this.phi, 3*Math.PI/4 - this.gap/2 + this.phi);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, fieldWidth/2 + ctx.lineWidth/2, 3*Math.PI/4 + this.gap/2 + this.phi, 5*Math.PI/4 - this.gap/2 + this.phi);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, fieldWidth/2 + ctx.lineWidth/2, 5*Math.PI/4 + this.gap/2 + this.phi, 7*Math.PI/4 - this.gap/2 + this.phi);
		ctx.stroke();
		
		
		
		this.phi += degToRad(2);
	}
};

function degToRad(degree) {
	return (2*Math.PI)/360 * degree;
}

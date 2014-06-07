var Cursor = function(canvas, color){
	this.pos = [0,0];
	this.gap = (2*Math.PI)/360 * 40;
	this.phi = 0;
	this.color = color;
	var self = this;
	canvas.addEventListener('mousemove', function(e) {
		var rect = canvas.getBoundingClientRect();
		self.pos = [e.clientX - rect.left , e.clientY - rect.top];
	});
};

Cursor.prototype = {
	draw: function(){
		var ctx = Graphics.ctx;
		var fieldWidth = Graphics.size.field;
		
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 4;
		
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], fieldWidth/2 + ctx.lineWidth/2, -Math.PI/4 + this.gap/2 + this.phi, Math.PI/4 - this.gap/2 + this.phi);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], fieldWidth/2 + ctx.lineWidth/2, Math.PI/4 + this.gap/2 + this.phi, 3*Math.PI/4 - this.gap/2 + this.phi);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], fieldWidth/2 + ctx.lineWidth/2, 3*Math.PI/4 + this.gap/2 + this.phi, 5*Math.PI/4 - this.gap/2 + this.phi);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], fieldWidth/2 + ctx.lineWidth/2, 5*Math.PI/4 + this.gap/2 + this.phi, 7*Math.PI/4 - this.gap/2 + this.phi);
		ctx.stroke();
		
		this.phi += (2*Math.PI)/360 * 2;
	}
};

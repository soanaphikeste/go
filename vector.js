var vec = function(x, y) {
	this.x = x;
	this.y = y;
	this.len = undefined;
	this.norm = undefined;
}

vec.prototype = {
	length : function() {
		if(this.len === undefined) {
			this.len = Math.sqrt(this.x*this.x + this.y*this.y);
		}
		return this.len;
	},
	normalize : function() {
		if(this.norm === undefined) {
			if(this.x == 0 && this.y == 0) 
				this.norm = new vec(0, 0);
			else
				this.norm = new vec(this.x / this.length(), this.y / this.length());
		}
		return this.norm;
	},
	add : function(v) {
		return new vec(this.x + v.x, this.y + v.y);
	},
	sub : function(v) {
		return new vec(this.x - v.x, this.y - v.y);
	},
	scalar : function(v) {
		return this.x * v.x + this.y * v.y;
	},
	mult : function(scalar) {
		return new vec(this.x * scalar, this.y * scalar);
	},
	componentDiv: function(v){
		return new vec(this.x/v.x, this.y/v.y);
	},
	bound : function(min, max) {
		var x = this.x > max.x ? max.x : this.x < min.x ? min.x : this.x;
		var y = this.y > max.y ? max.y : this.y < min.y ? min.y : this.y;
		return new vec(x, y);
	},
	equals : function(v) {
		return v.x == this.x && v.y == this.y;
	},
	getRad : function() {
		var f =  Math.acos(
			this.scalar(new vec(1, 0)) / this.length() // * 1
		);
		if(this.y < 0) 
			f = Math.PI * 2 - f;
		return f;
	},
	greaterThan : function(v) {
		return this.x > v.x || this.y > v.y;
	},
	lessThan : function(v) {
		return this.x < v.x || this.y < v.y;
	},
	floor: function(){
		return new vec(parseInt(this.x), parseInt(this.y));
	},
	ceil: function(){
		return new vec(parseInt(this.x)+1, parseInt(this.y)+1);
	},
	round: function(){
		return new vec(Math.round(this.x), Math.round(this.y));
	}
};

function rad2vec(rad) {
	return new vec(Math.cos(rad), Math.sin(rad));
};

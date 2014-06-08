var Connection = {
	init: function(){
		this.openListener = [];
		this.errorListener = [];
		this.closeListener = [];
		this.messageListener = {};
		this.responses = {};
		
		this.socket = new WebSocket("ws://"+ location.hostname + ":" + port + "/");
		var self = this;
		this.socket.onmessage = function(evt){
			self.onMessage(evt);
		};
		this.socket.onopen = function(evt){
			self.onOpen(evt);
		};
		this.socket.onclose = function(evt){
			self.onClose(evt);
		};
		this.socket.onerror = function(evt){
			self.onError(evt);
		};
		
	},
	
	onMessage: function(evt){
		console.log("received: " + evt.data);
		var obj = JSON.parse(evt.data);
		if(obj.type === undefined || obj.id === undefined){
			console.error("Invalid packet received: " + obj + " - Required field missing");
			return;
		}
		
		if(obj.type == "req" && obj.key !== undefined){
			var handler = this.messageListener[obj.key];
			if(handler !== undefined){
				var ans = handler(obj.param);
				var answer = {
					id: obj.id,
					type: "res",
					param: ans
				};
				this.socket.send(JSON.stringify(answer));
			}
			else{
				console.error("Unknown key received: " + evt.data);
				return;
			}
		}
		else if(obj.type == "res"){
			var handler = this.responses[obj.id];
			if(handler !== undefined){
				handler(obj.param);
				this.responses[obj.id] = undefined;
			}
		}
		else{
			console.error("Invalid packet received: " + obj + " - Key missing");
			return;
		}
	},
	
	onOpen: function(evt){
		for(l in this.openListener){
			this.openListener[l](evt);
		}
	},
	
	onClose: function(evt){
		for(l in this.closeListener){
			this.closeListener[l](evt);
		}
	},
	
	onError: function(evt){
		for(l in this.errorListener){
			this.errorListener[l](evt);
		}
	},
	
	addOpenListener: function(listener){
		this.openListener.push(listener);
	},
	
	addErrorListener: function(listener){
		this.errorListener.push(listener);
	},
	
	addCloseListener: function(listener){
		this.closeListener.push(listener);
	},
	
	addMessageListener: function(key, listener){
		this.messageListener[key] = listener;
	},
	send: function(key, param, handler){
		var meta = {
			param: param,
			key: key,
			type: "req",
			id: this.id++
		};
		this.responses[id] = handler;
		console.log("send: " + JSON.stringify(meta));
		this.socket.send(JSON.stringify(meta));
	}
};

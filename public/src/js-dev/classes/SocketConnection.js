/*globals io:true */

var SocketConnection = (function(){

	var connectionEstablished = false;
	var currentBoardColor = 'currentColor';

	function SocketConnection() {
		_.bindAll(this);
	}

	SocketConnection.prototype.init = function() {
		this.socket = io.connect(':1337');

		var self = this;
		
		this.socket.on('horizontalPosition', function(data) {
			bean.fire(self, 'horizontalPosition', data);
		});

		this.socket.on('jump', function(data) {
			if (data) {
				bean.fire(self, 'jump');
			}
		});

		this.socket.on('weight', function(data) {
			if (data) {
				bean.fire(self, 'weightReceived', data);
			}
		});

		this.socket.on('disconnect', function(data){
			console.log('server shut down');
			//bean.fire(self, 'cancelConnection');
		});

		this.socket.on('otherUserConnected', function(data) {
			if (!data && !connectionEstablished) {
				connectionEstablished = true;
				bean.fire(self, 'connectionOk');
			}else if(!connectionEstablished){
				this.socket.disconnect();
				bean.fire(self, 'cancelConnection');
			}else{
				console.log('server reconnected');
			}	
		});
	};

	SocketConnection.prototype.askForWeight = function(){
		this.socket.emit('askForWeight');
	};

	SocketConnection.prototype.setBoardColor = function(color){
		if (color !== currentBoardColor) {
			console.log('set board color: ' + color);
			this.socket.emit('setBoardColor', color);	
		}else{
			console.log('board is already ' + color);
		}

		currentBoardColor = color;
		
	};

	SocketConnection.prototype.setBoardColorByRGB = function(red, green, blue){
		this.socket.emit('setBoardColor', red, green, blue);
	};

	return SocketConnection;
})();
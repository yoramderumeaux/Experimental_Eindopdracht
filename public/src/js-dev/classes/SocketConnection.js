/*globals io:true */

var SocketConnection = (function(){

	var connectionEstablished = false;

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

	return SocketConnection;
})();
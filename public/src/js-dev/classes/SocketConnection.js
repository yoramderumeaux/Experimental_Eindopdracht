/*globals io:true */

var SocketConnection = (function(){

	var connectionEstablished = false;

	function SocketConnection() {
		_.bindAll(this);
	}

	SocketConnection.prototype.init = function() {
		var socket = io.connect(':1337');

		var self = this;
		
		socket.on('horizontalPosition', function(data) {
			bean.fire(self, 'horizontalPosition', data);
		});

		socket.on('jump', function(data) {
			if (data) {
				bean.fire(self, 'jump');
			}
		});

		socket.on('disconnect', function(data){
			console.log('server shut down');
			//bean.fire(self, 'cancelConnection');
		});

		socket.on('otherUserConnected', function(data) {
			if (!data && !connectionEstablished) {
				connectionEstablished = true;
				bean.fire(self, 'connectionOk');
			}else if(!connectionEstablished){
				socket.disconnect();
				bean.fire(self, 'cancelConnection');
			}else{
				console.log('server reconnected');
			}	
		});
	};

	return SocketConnection;
})();
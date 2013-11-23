/*globals io:true */

var SocketConnection = (function(){

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
			if (!data) {
				bean.fire(self, 'connectionOk');
			}else{
				socket.disconnect();
				bean.fire(self, 'cancelConnection');
			}
		});
	};

	return SocketConnection;
})();
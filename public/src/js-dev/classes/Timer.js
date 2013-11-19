var Timer = (function(){

	var myTimer;

	function Timer() {
		_.bindAll(this);
		this.timer = 60;

		// Set the startTime
		//$('#timer p').html(this.timer);
	}

	Timer.prototype.start = function() {
		myTimer =  setInterval(this.update, 1000);
	};

	Timer.prototype.stop = function() {
		clearInterval(myTimer);
	};

	Timer.prototype.restart = function(){
		this.timer = 60;
		this.update();
	};

	Timer.prototype.update = function() {
		
		$('#timer p').html(this.timer);

		if(this.timer === 0) {
			this.stop();
			bean.fire(this, 'endTimer');
		}

		this.timer --;
	};

	return Timer;

})();
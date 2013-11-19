var Timer = (function(){

	var myTimer;

	function Timer() {
		_.bindAll(this);
		this.timerValue = 120;
		this.timer = this.timerValue;
		$('#timer p').html(this.timer);
		// Set the startTime
		//$('#timer p').html(this.timer);
	}

	Timer.prototype.start = function() {
		this.timer = this.timerValue;
		myTimer =  setInterval(this.update, 1000);
	};

	Timer.prototype.stop = function() {
		console.log('Clear timer');
		$('#timer p').html('');
		clearInterval(myTimer);
	};

	Timer.prototype.restart = function(){
		this.timer = this.timerValue;
		this.stop();
		this.start();
		//this.update();
	};

	Timer.prototype.update = function() {
		console.log('update'+Math.random());
		
		$('#timer p').html(this.timer);

		if(this.timer <= 0) {
			this.stop();
			bean.fire(this, 'endTimer');
		}

		this.timer --;
	};

	return Timer;

})();
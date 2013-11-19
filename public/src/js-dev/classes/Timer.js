var Timer = (function(){

	var myTimer;
	var eventTimer = 1;
	var numberOfEvents = 3;

	function Timer() {
		_.bindAll(this);
		this.timerValue = 60;
		this.timer = this.timerValue;
		numberOfEvents = Math.floor(this.timerValue/10);
		$('#timer p').html(this.timer);
	}

	Timer.prototype.start = function() {
		this.timer = this.timerValue;
		eventTimer = 1;
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
	};

	Timer.prototype.update = function() {
		$('#timer p').html(this.timer);

		if(this.timer <= 0) {
			this.stop();
			bean.fire(this, 'endTimer');
		}else if(this.timer < (this.timerValue / numberOfEvents) * (numberOfEvents-eventTimer)){			
			eventTimer ++;
			console.log('speed up in timer');
			bean.fire(this, 'speedUpMeteorites');
		}

		this.timer --;
	};

	return Timer;

})();
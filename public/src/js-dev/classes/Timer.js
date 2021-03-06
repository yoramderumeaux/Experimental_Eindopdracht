var Timer = (function(){

	var myTimer;
	var eventTimer = 1;
	var numberOfEvents = 3;

	function Timer() {
		_.bindAll(this);
		this.timerValue = 60;
		this.isRunning = false;
		this.timer = this.timerValue;
		numberOfEvents = Math.floor(this.timerValue/10);

		//$('#timer p').html(this.timer);
	}

	Timer.prototype.start = function() {
		console.log('[TIMER] start timer');
		this.timer = this.timerValue;
		this.isRunning = true;
		eventTimer = 1;
		this.update();
		myTimer =  setInterval(this.update, 1000);
	};

	Timer.prototype.stop = function() {
		console.log('[TIMER] stop timer');
		$('#timer p').html('');
		this.isRunning = false;
		clearInterval(myTimer);
	};

	Timer.prototype.update = function() {
		$('#timer p').html(this.timer);

		bean.fire(this, 'secondPast');

		if(this.timer <= 0) {
			this.stop();
			bean.fire(this, 'endTimer');
		}else if(this.timer < (this.timerValue / numberOfEvents) * (numberOfEvents-eventTimer)){			
			eventTimer ++;
			bean.fire(this, 'speedUpMeteorites');
		}

		if (this.timer <= 10) {

			if (this.timer <= 3) {
				if (this.timer !== 0) {
					bean.fire(this, 'beep', 'double');	
				}
			}else{
				bean.fire(this, 'beep', 'single');
			}
		}

		this.timer --;
	};

	return Timer;

})();
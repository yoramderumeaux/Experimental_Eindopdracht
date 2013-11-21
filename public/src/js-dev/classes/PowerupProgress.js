var PowerupProgress = (function(){

	var canvasWidth = 0;
	var canvasHeight = 0;
	var milisec = 40;

	function PowerupProgress() {
		this.x = 0;
		this.y = 0;
		this.timer = null;
		this.timerValue = 0;
		this.currentTimerValue = 0;

		canvasWidth = $('#cnvs').width() +5;
		canvasHeight = $('#cnvs').height()+5;

		this.powerupProgress = new createjs.Container();
		this.powerupProgress.y = canvasHeight;
		this.powerupProgress.x = 0;

		this.hideProgressBar = true;

		this.drawSliders();

		//this.beginShootProgress(3000);
	}

	PowerupProgress.prototype.drawSliders = function(){
		this.greenprogressSlider = new createjs.Shape();
		this.greenprogressSlider.y = 0;
		this.greenprogressSlider.x = - canvasWidth;
		this.greenprogressSlider.graphics.beginFill('rgba(174,246,157,1)');
		this.greenprogressSlider.graphics.drawRect(0,0,canvasWidth,15);

		this.blueprogressSlider = new createjs.Shape();
		this.blueprogressSlider.y = 0;
		this.blueprogressSlider.x = - canvasWidth;
		this.blueprogressSlider.graphics.beginFill('rgba(0,210,255,1)');
		this.blueprogressSlider.graphics.drawRect(0,0,canvasWidth,15);

		this.greenprogressbar = new createjs.Shape();
		this.greenprogressbar.x = this.x;
		this.greenprogressbar.y = 0;
		this.greenprogressbar.graphics.beginFill('rgba(0, 92,112,0.2)');
		this.greenprogressbar.graphics.beginStroke('#aef69d');
		this.greenprogressbar.graphics.drawRect(0,0,canvasWidth,15);
		this.greenprogressbar.shadow = new createjs.Shadow('#1bf43f', 0, 0, 10);
		
		this.blueprogressbar = new createjs.Shape();
		this.blueprogressbar.x = this.x;
		this.blueprogressbar.y = 0;
		this.blueprogressbar.graphics.beginFill('rgba(0, 92,112,0.2)');
		this.blueprogressbar.graphics.beginStroke('#00d2ff');
		this.blueprogressbar.graphics.drawRect(0,0,canvasWidth,15);
		this.blueprogressbar.shadow = new createjs.Shadow('#005c70', 0, 0, 10);

		this.powerupProgress.addChild(this.greenprogressSlider);
		this.powerupProgress.addChild(this.blueprogressSlider);
		this.powerupProgress.addChild(this.greenprogressbar);
		this.powerupProgress.addChild(this.blueprogressbar);
	};

	PowerupProgress.prototype.beginShootProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 1;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 0;
		this.startTimer(time);
	};

	PowerupProgress.prototype.beginWarpProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 0;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 1;
		this.startTimer(time);
	};

	PowerupProgress.prototype.startTimer = function(time){
		this.hideProgressBar = false;
		this.timerValue = Math.round(time/milisec);
		this.currentTimerValue = 0;
		var self = this;
		self.greenprogressSlider.x = self.blueprogressSlider.x = - canvasWidth;

		this.timer = setInterval(function(){

			if (self.currentTimerValue > self.timerValue) {
				clearInterval(self.timer);
				self.hideProgressBar = true;
				
			}else{
				self.greenprogressSlider.x = self.blueprogressSlider.x = - canvasWidth + (canvasWidth* (self.currentTimerValue/self.timerValue));
				self.currentTimerValue ++;				
			}

		}, milisec);
	};

	PowerupProgress.prototype.update = function(){
		if (this.hideProgressBar) {
			this.powerupProgress.y += ((canvasHeight+1) - this.powerupProgress.y)*0.1;
		}else{
			this.powerupProgress.y += ((canvasHeight-10) - this.powerupProgress.y)*0.1;
		}
	};

	return PowerupProgress;

})();
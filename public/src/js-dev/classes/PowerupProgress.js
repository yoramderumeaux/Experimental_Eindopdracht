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
	}

	PowerupProgress.prototype.drawSliders = function(){

		var progressBarHeight = 50;
		this.greenprogressSlider = new createjs.Shape();
		this.greenprogressSlider.y = 0;
		this.greenprogressSlider.x = - canvasWidth;
		this.greenprogressSlider.graphics.beginFill('#aef69d');
		this.greenprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.blueprogressSlider = new createjs.Shape();
		this.blueprogressSlider.y = 0;
		this.blueprogressSlider.x = - canvasWidth;
		this.blueprogressSlider.graphics.beginFill('#00d2ff');
		this.blueprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.redprogressSlider = new createjs.Shape();
		this.redprogressSlider.y = 0;
		this.redprogressSlider.x = - canvasWidth;
		this.redprogressSlider.graphics.beginFill('#e75f5f');
		this.redprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.yellowprogressSlider = new createjs.Shape();
		this.yellowprogressSlider.y = 0;
		this.yellowprogressSlider.x = - canvasWidth;
		this.yellowprogressSlider.graphics.beginFill('#fff448');
		this.yellowprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.purpleprogressSlider = new createjs.Shape();
		this.purpleprogressSlider.y = 0;
		this.purpleprogressSlider.x = - canvasWidth;
		this.purpleprogressSlider.graphics.beginFill('#AE81FF');
		this.purpleprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.redprogressSlider = new createjs.Shape();
		this.redprogressSlider.y = 0;
		this.redprogressSlider.x = - canvasWidth;
		this.redprogressSlider.graphics.beginFill('#e75f5f');
		this.redprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.greenprogressbar = new createjs.Shape();
		this.greenprogressbar.x = this.x;
		this.greenprogressbar.y = 0;
		this.greenprogressbar.graphics.beginFill('rgba(0, 92, 112, 0.2)');
		this.greenprogressbar.graphics.beginStroke('#aef69d');
		this.greenprogressbar.graphics.drawRect(0,0,canvasWidth,progressBarHeight);
		this.greenprogressbar.shadow = new createjs.Shadow('#1bf43f', 0, 0, 10);
		
		this.blueprogressbar = new createjs.Shape();
		this.blueprogressbar.x = this.x;
		this.blueprogressbar.y = 0;
		this.blueprogressbar.graphics.beginFill('rgba(0, 92, 112, 0.2)');
		this.blueprogressbar.graphics.beginStroke('#00d2ff');
		this.blueprogressbar.graphics.drawRect(0,0,canvasWidth,progressBarHeight);
		this.blueprogressbar.shadow = new createjs.Shadow('#005c70', 0, 0, 10);	

		//kleuren nog aanpassen
		this.yellowprogressbar = new createjs.Shape();
		this.yellowprogressbar.x = this.x;
		this.yellowprogressbar.y = 0;
		this.yellowprogressbar.graphics.beginFill('rgba(0, 92, 112, 0.2)');
		this.yellowprogressbar.graphics.beginStroke('#fff448');
		this.yellowprogressbar.graphics.drawRect(0,0,canvasWidth,progressBarHeight);
		this.yellowprogressbar.shadow = new createjs.Shadow('#fff665', 0, 0, 10);

		//kleuren nog aanpassnen
		this.purpleprogressbar = new createjs.Shape();
		this.purpleprogressbar.x = this.x;
		this.purpleprogressbar.y = 0;
		this.purpleprogressbar.graphics.beginFill('rgba(0, 92, 112, 0.2)');
		this.purpleprogressbar.graphics.beginStroke('#AE81FF');
		this.purpleprogressbar.graphics.drawRect(0,0,canvasWidth,progressBarHeight);
		this.purpleprogressbar.shadow = new createjs.Shadow('#8542ff', 0, 0, 10);	

		this.redprogressbar = new createjs.Shape();
		this.redprogressbar.x = this.x;
		this.redprogressbar.y = 0;
		this.redprogressbar.graphics.beginFill('rgba(0, 92, 112, 0.2)');
		this.redprogressbar.graphics.beginStroke('#e75f5f');
		this.redprogressbar.graphics.drawRect(0,0,canvasWidth,progressBarHeight);
		this.redprogressbar.shadow = new createjs.Shadow('#db2020', 0, 0, 10);

		this.powerupProgress.addChild(this.greenprogressSlider);
		this.powerupProgress.addChild(this.blueprogressSlider);
		this.powerupProgress.addChild(this.redprogressSlider);
		this.powerupProgress.addChild(this.yellowprogressSlider);
		this.powerupProgress.addChild(this.purpleprogressSlider);
		this.powerupProgress.addChild(this.greenprogressbar);
		this.powerupProgress.addChild(this.blueprogressbar);
		this.powerupProgress.addChild(this.yellowprogressbar);
		this.powerupProgress.addChild(this.purpleprogressbar);
		this.powerupProgress.addChild(this.redprogressbar);
	};

	PowerupProgress.prototype.beginShootProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 1;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 0;
		this.redprogressbar.alpha = this.redprogressSlider.alpha = 0;
		this.yellowprogressbar.alpha = this.yellowprogressSlider.alpha = 0;
		this.purpleprogressbar.alpha = this.purpleprogressSlider.alpha = 0;
		this.startTimer(time);
	};

	PowerupProgress.prototype.beginWarpProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 0;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 1;
		this.redprogressbar.alpha = this.redprogressSlider.alpha = 0;
		this.yellowprogressbar.alpha = this.yellowprogressSlider.alpha = 0;
		this.purpleprogressbar.alpha = this.purpleprogressSlider.alpha = 0;
		this.startTimer(time);
	};

	PowerupProgress.prototype.beginReverseProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 0;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 0;
		this.redprogressbar.alpha = this.redprogressSlider.alpha = 1;
		this.yellowprogressbar.alpha = this.yellowprogressSlider.alpha = 0;
		this.purpleprogressbar.alpha = this.purpleprogressSlider.alpha = 0;
		this.startTimer(time);
	};

	PowerupProgress.prototype.beginSmallerProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 0;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 0;
		this.redprogressbar.alpha = this.redprogressSlider.alpha = 0;
		this.yellowprogressbar.alpha = this.yellowprogressSlider.alpha = 1;
		this.purpleprogressbar.alpha = this.purpleprogressSlider.alpha = 0;
		this.startTimer(time);
	};

	PowerupProgress.prototype.beginBiggerProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 0;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 0;
		this.redprogressbar.alpha = this.redprogressSlider.alpha = 0;
		this.yellowprogressbar.alpha = this.yellowprogressSlider.alpha = 0;
		this.purpleprogressbar.alpha = this.purpleprogressSlider.alpha = 1;
		this.startTimer(time);
	};

	PowerupProgress.prototype.startTimer = function(time){
		this.hideProgressBar = false;
		this.timerValue = Math.round(time/milisec);
		this.currentTimerValue = 0;
		var self = this;
		self.greenprogressSlider.x = self.blueprogressSlider.x = self.redprogressSlider.x = self.yellowprogressSlider.x = self.purpleprogressSlider.x = - canvasWidth;

		this.timer = setInterval(function(){

			if (self.currentTimerValue > self.timerValue) {
				clearInterval(self.timer);
				self.hideProgressBar = true;
				
			}else{
				self.greenprogressSlider.x = self.blueprogressSlider.x = self.redprogressSlider.x = self.yellowprogressSlider.x = self.purpleprogressSlider.x = - canvasWidth + (canvasWidth* (self.currentTimerValue/self.timerValue));
				self.currentTimerValue ++;				
			}

		}, milisec);
	};

	PowerupProgress.prototype.reset = function(){
		this.currentTimerValue = 0;
		this.hideProgressBar = true;
		this.powerupProgress.y = (canvasHeight+1);
	};

	PowerupProgress.prototype.update = function(){
		if (this.hideProgressBar) {
			this.powerupProgress.y += ((canvasHeight+1) - this.powerupProgress.y)*0.1;
		}else{
			this.powerupProgress.y += ((canvasHeight-30) - this.powerupProgress.y)*0.1;
		}
	};

	return PowerupProgress;

})();
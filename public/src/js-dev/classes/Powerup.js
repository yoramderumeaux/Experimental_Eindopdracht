var Powerup = (function(){

	var x;
	var y;
	var primaryColor = ['#aef69d', '#00d2ff', '#e75f5f', '#fff448', '#AE81FF'];
	var shadowColor = ['#1bf43f', '#005c70', '#db2020', '#fff665', '#8542ff'];

	function Powerup(x, y) {
		_.bindAll(this);
		this.x = x;
		this.y = y;
		this.velY = 0;
		this.speed = 30;
		this.speedFactor = 1;
		this.types = ['shoot', 'warp', 'reverse', 'smaller', 'bigger'];
		this.enableWarpSpeed = false;
		this.warpSpeedTarget = 30;
		this.currentWarpSpeed = 0;
		this.rotationDirection = -1 + 2*(Math.random());
		this.removeMe = false;
		this.readyToRemove = false;
		this.collected = false;
		this.randomNumber = 0;
	}

	Powerup.prototype.init = function(type) {	
		this.speed = (30+ Math.round(Math.random()*30)) * this.speedFactor;
		if ($.isNumeric(type)) {
			//this.randomNumber = Math.floor(Math.random()*types.length);
			this.randomNumber = type;
		}else{
			switch(type){
				case 'warp':
				this.randomNumber = 1;
				break;
				case 'shoot':
				this.randomNumber = 0;
				break;
				case 'reverse':
				this.randomNumber = 2;
				break;
				case 'smaller':
				this.randomNumber = 3;
				break;
				case 'bigger':
				this.randomNumber = 4;
				break;
			}
		}
		
		this.type = this.types[this.randomNumber];
		this.drawPowerup();
	};

	Powerup.prototype.drawPowerup = function(){

		this.powerup = new createjs.Container();

		this.powerup.x = this.x;
		this.powerup.y = this.y;
		this.powerup.width = 50;
		this.powerup.height = 50;

		var squareSize = 40;
		var square = new createjs.Shape();

		square.graphics.beginStroke(primaryColor[this.randomNumber]);
		this.powerup.shadow = new createjs.Shadow(shadowColor[this.randomNumber], 0, 0, 10);
		square.graphics.beginFill('rgba(0, 92,112,0.2)');
		
		square.graphics.setStrokeStyle(3);
		square.graphics.drawRect(-(squareSize/2),-(squareSize/2),squareSize,squareSize);
		square.rotation = 45;

		square.graphics.setStrokeStyle(3);
		square.graphics.drawCircle(0,0,25);
		square.graphics.endStroke();

		this.powerup.addChild(square);

		if (this.type === 'warp') {
			var iconlines = new createjs.Shape();
			var yOffset = 2;
			iconlines.graphics.beginStroke('#00d2ff');
			iconlines.graphics.setStrokeStyle(4);
			iconlines.graphics.moveTo(-10, 0 - yOffset);	
			iconlines.graphics.lineTo(0, -10- yOffset);
			iconlines.graphics.lineTo(10, 0- yOffset);

			iconlines.graphics.moveTo(-10, 10- yOffset);	
			iconlines.graphics.lineTo(0, 0- yOffset);
			iconlines.graphics.lineTo(10, 10- yOffset);

			this.powerup.addChild(iconlines);
			
		}else if(this.type === 'shoot') {
			var circles =  new createjs.Shape();
			circles.graphics.beginFill('#aef69d');
			circles.graphics.drawCircle(-10,3,4);
			circles.graphics.endFill();
			circles.graphics.beginFill('#aef69d');
			circles.graphics.drawCircle(0,-10,4);
			circles.graphics.endFill();
			circles.graphics.beginFill('#aef69d');
			circles.graphics.drawCircle(10,3,4);
			circles.graphics.endFill();
			circles.graphics.beginFill('#aef69d');
			circles.graphics.endFill();

			this.powerup.addChild(circles);

		}else if(this.type === 'reverse') {
			var arrowLines = new createjs.Shape();
			arrowLines.graphics.beginStroke(primaryColor[this.randomNumber]);
			arrowLines.graphics.setStrokeStyle(3);
			arrowLines.graphics.moveTo(10, -5);
			arrowLines.graphics.lineTo(-10, -5);
			arrowLines.graphics.lineTo(-6, -9);
			arrowLines.graphics.moveTo(-10, -5);
			arrowLines.graphics.lineTo(-6, -1);

			arrowLines.graphics.moveTo(-10, 5);
			arrowLines.graphics.lineTo(10, 5);
			arrowLines.graphics.lineTo(6, 1);
			arrowLines.graphics.moveTo(10,5);
			arrowLines.graphics.lineTo(6, 9);

			this.powerup.addChild(arrowLines);

		}else if(this.type === 'smaller') {
			var resizer = new createjs.Shape();
			resizer.graphics.beginStroke(primaryColor[this.randomNumber]);
			resizer.graphics.setStrokeStyle(3);
			resizer.graphics.drawRect(-10, -10, 20, 20);
			resizer.graphics.setStrokeStyle(1);
			resizer.graphics.drawRect(-2, -2, 4, 4);

			this.powerup.addChild(resizer);

		}else if(this.type === 'bigger') {
			var resizerBig = new createjs.Shape();
			resizerBig.graphics.beginStroke(primaryColor[this.randomNumber]);

			resizerBig.graphics.setStrokeStyle(1);
			resizerBig.graphics.drawRect(-10, -10, 20, 20);
			resizerBig.graphics.setStrokeStyle(7);
			resizerBig.graphics.drawRect(-2, -2, 4, 4);

			this.powerup.addChild(resizerBig);
		}		


	};

	Powerup.prototype.updateWithFPSCorrection = function(fpsCorrection) {

		if (!this.collected) {
			/*if (this.currentWarpSpeed < (this.warpSpeedTarget*this.enableWarpSpeed)) {
				this.currentWarpSpeed += 0.01;
			}else{
				this.currentWarpSpeed = 0;
			}
			*/
			this.y += (this.velY * (this.speed * (1 + this.currentWarpSpeed *30)))/fpsCorrection;
			this.powerup.y = this.y;
			var lol = 1;
		}else{
			this.powerup.scaleX = this.powerup.scaleY += 0.1/fpsCorrection;
			this.powerup.alpha -= (0.1/fpsCorrection);

			if (this.powerup.alpha <= 0) {
				this.readyToRemove = true;
			}
		}
		
	};

	return Powerup;

})();
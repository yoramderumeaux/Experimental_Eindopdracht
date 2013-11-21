var Powerup = (function(){

	var x;
	var y;
	var types = ['shoot', 'warp'];

	function Powerup(x, y) {
		_.bindAll(this);
		this.x = x;
		this.y = y;
		this.velY = 0;
		this.speed = 30;
		this.speedFactor = 1;
		this.enableWarpSpeed = false;
		this.warpSpeedTarget = 30;
		this.currentWarpSpeed = 0;
		this.rotationDirection = -1 + 2*(Math.random());
		this.removeMe = false;
		this.readyToRemove = false;
		this.collected = false;
	}

	Powerup.prototype.init = function() {		
		this.type = types[Math.floor(Math.random()*types.length)];
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

		if (this.type === 'shoot') {
			square.graphics.beginStroke('#aef69d');
			this.powerup.shadow = new createjs.Shadow('#1bf43f', 0, 0, 10);
			square.graphics.beginFill('rgba(0, 92,112,0.2)');
		}else{
			square.graphics.beginStroke('#00d2ff');
			square.graphics.beginFill('rgba(0, 92,112,0.2)');
			this.powerup.shadow = new createjs.Shadow('#005c70', 0, 0, 10);
		}
		
		square.graphics.setStrokeStyle(3);
		square.graphics.drawRect(-(squareSize/2),-(squareSize/2),squareSize,squareSize);
		square.rotation = 45;

		//square.graphics.beginStroke('#eba19f');
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
			
		}else if(this.type === 'shoot'){

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
		}		
	};

	Powerup.prototype.update = function() {

		if (!this.collected) {
			if (this.currentWarpSpeed < (this.warpSpeedTarget*this.enableWarpSpeed)) {
				this.currentWarpSpeed += 0.01;
			}else{
				this.currentWarpSpeed = 0;
			}
			
			this.y += this.velY * (this.speed * (1 + this.currentWarpSpeed *30));
			this.powerup.y = this.y;
		}else{
			this.powerup.scaleX = this.powerup.scaleY += 0.1;
			this.powerup.alpha -= 0.1;

			if (this.powerup.alpha <= 0) {
				this.readyToRemove = true;
			}
		}
		
	};

	return Powerup;

})();
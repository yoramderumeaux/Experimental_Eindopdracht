var Meteorite = (function(){

	var x;
	var y;
	var width;
	var height;
	var enableFill = true;
	
	var meteoriteShape1 = [
		[11,22],
		[23,23],
		[24,11],
		[35,7],
		[50,15],
		[62,39],
		[62,47],
		[52,60],
		[23,62],
		[9,46],
		[11,22]
	];
	var meteoriteShape2 = [
		[23,4],
		[37,10],
		[51,6],
		[66,27],
		[55,38],
		[54,49],
		[38,63],
		[22,62],
		[21,46],
		[11,40],
		[4,26],
		[23,4]
	];

	var meteoriteShape3 = [
		[31,7],
		[49,12],
		[60,25],
		[64,38],
		[57,52],
		[36,62],
		[26,57],
		[9,58],
		[11,40],
		[5,28],
		[14,13],
		[31,7]
	];

	var meteoriteShapes = [meteoriteShape1, meteoriteShape2, meteoriteShape3];

	function Meteorite(x, y) {
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
		this.canDoDamage = true;
		this.readyToRemove = false;
		//this.gravity = 3.8;
	}

	Meteorite.prototype.init = function() {

		this.speed = (10+ Math.round(Math.random()*20)) * this.speedFactor;

		this.meteorite = new createjs.Shape();
		this.meteorite.x = this.x;
		this.meteorite.y = this.y;

		//this.meteorite.scaleX = this.meteorite.scaleY =0.5 + (Math.random()*0.3);
		this.meteorite.width *= this.meteorite.scaleX;
		this.meteorite.height *= this.meteorite.scaleY;

		this.drawMeteorite();

		//console.log(this.speedFactor);
	};

	Meteorite.prototype.gotShot = function(){
		this.removeMe = true;
		this.canDoDamage = false;
	};

	Meteorite.prototype.drawMeteorite = function() {

		this.meteorite.graphics.beginStroke('#fcf5bf');
		this.meteorite.graphics.setStrokeStyle(3);
		if(enableFill) {this.meteorite.graphics.beginFill('rgba(206, 75,29,0.1)');}

		var randomMeteorite = meteoriteShapes[Math.round(Math.random()*2)];

		var shapeWidthMin = 10000;
		var shapeWidthMax = 0;
		var shapeHeightMin = 10000;
		var shapeHeightMax = 0;

		for (var i = 0; i < randomMeteorite.length; i++) {
			shapeWidthMin = Math.min(shapeWidthMin, randomMeteorite[i][0]);
			shapeWidthMax = Math.max(shapeWidthMax, randomMeteorite[i][0]);
			shapeHeightMin = Math.min(shapeHeightMin, randomMeteorite[i][1]);
			shapeHeightMax = Math.max(shapeHeightMax, randomMeteorite[i][1]);
		}

		this.meteorite.width = shapeWidthMax - shapeWidthMin;
		this.meteorite.height = shapeHeightMax - shapeHeightMin;

		var horizontalOffset = ((shapeWidthMax- shapeWidthMin)/2) + shapeWidthMin;
		var verticalOffset = ((shapeHeightMax - shapeHeightMin)/2) + shapeWidthMin;

		//horizontalOffset = verticalOffset = 0;

		for (var j = 0; j < randomMeteorite.length; j++) {
			if (j === 0){
				this.meteorite.graphics.moveTo(randomMeteorite[j][0] - horizontalOffset, randomMeteorite[j][1] - verticalOffset);	
			}else{
				this.meteorite.graphics.lineTo(randomMeteorite[j][0] - horizontalOffset, randomMeteorite[j][1] - verticalOffset);	
			}
		}
		
		if(enableFill) {this.meteorite.graphics.endFill();}
		this.meteorite.graphics.endStroke();
		this.meteorite.shadow = new createjs.Shadow('#ce4b1d', 0, 0, 5);
	};

	Meteorite.prototype.update = function() {

		if (this.currentWarpSpeed < (this.warpSpeedTarget*this.enableWarpSpeed)) {
			this.currentWarpSpeed += 0.01;
		}else{
				this.currentWarpSpeed = 0;
		}
		
		this.y += this.velY * (this.speed * (1 + this.currentWarpSpeed *30));
		this.meteorite.y = this.y;
		this.meteorite.rotation += (this.rotationDirection * (this.speed)/40);
		//this.meteorite.rotation += 30;
		this.velY *= this.gravity;

		if (this.removeMe) {
			this.meteorite.scaleX = this.meteorite.scaleY += (0 - this.meteorite.scaleX) * 0.1;

			if (this.meteorite.scaleX < 0.05) {
				this.readyToRemove = true;
			}
		}

		//this.meteorite.y = this.y = 200;
	};


	return Meteorite;

})();
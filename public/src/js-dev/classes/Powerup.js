var Powerup = (function(){

	var x;
	var y;

	function Powerup(x, y) {
		_.bindAll(this);
		this.x = x;
		this.y = y;
	}

	Powerup.prototype.init = function() {
		this.powerup = new createjs.Shape();
		this.powerup.width = 4;
		this.powerup.height = 4;
		
		this.type = 'warp';
		this.drawPowerup();
	};

	Powerup.prototype.drawPowerup = function(){

		this.powerup = new createjs.Container();

		this.powerup.x = this.x;
		this.powerup.y = this.y;

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
		//square.graphics.endStroke();
		square.rotation = 45;
		//this.powerup.shadow = new createjs.Shadow('#eb1c17', 0, 0, 10);

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

	};

	return Powerup;

})();
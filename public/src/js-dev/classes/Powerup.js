var Powerup = (function(){

	var x;
	var y;

	function Powerup() {
		_.bindAll(this);
	}

	Powerup.prototype.init = function() {
		this.powerup = new createjs.Shape();
		this.powerup.width = 4;
		this.powerup.height = 4;
		this.powerup.x = this.x;
		this.powerup.y = this.y;
		this.drawBullet();
	};

	Powerup.prototype.drawPowerup = function(){
		this.powerup.graphics.beginStroke('#eba19f');
		this.powerup.graphics.setStrokeStyle(3);
		this.powerup.graphics.drawRect(0,0,30,30);
		// this.bullet.graphics.moveTo(0, -27.75);
		// this.bullet.graphics.lineTo(25, 27.75);
		// this.bullet.graphics.lineTo(-25, 27.75);
		// this.bullet.graphics.lineTo(0, -27.75);
		this.powerup.graphics.endStroke();
		this.powerup.shadow = new createjs.Shadow('#eb1c17', 0, 0, 10);
	};

	Powerup.prototype.update = function() {

	};

	return Powerup;

})();
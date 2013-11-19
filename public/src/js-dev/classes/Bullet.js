var Bullet = (function(){

	var x;
	var y;
	var directionAngle;

	function Bullet() {
		_.bindAll(this);
	}

	Bullet.prototype.init = function() {
		this.bullet = new createjs.Shape();
		this.bullet.width = 4;
		this.bullet.height = 4;
		this.bullet.x = this.x;
		this.bullet.y = this.y;
		this.drawBullet();

	};

	Bullet.prototype.drawBullet = function(){
		this.bullet.graphics.beginStroke('#eba19f');
		this.bullet.graphics.setStrokeStyle(3);
		this.bullet.graphics.drawCircle(0,0,2);
		// this.bullet.graphics.moveTo(0, -27.75);
		// this.bullet.graphics.lineTo(25, 27.75);
		// this.bullet.graphics.lineTo(-25, 27.75);
		// this.bullet.graphics.lineTo(0, -27.75);
		this.bullet.graphics.endStroke();
		this.bullet.shadow = new createjs.Shadow('#eb1c17', 0, 0, 10);
	};

	Bullet.prototype.update = function() {

	};

	return Bullet;

})();
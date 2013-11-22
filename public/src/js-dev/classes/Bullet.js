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
		this.bullet.graphics.beginStroke('#aef69d');
		this.bullet.graphics.setStrokeStyle(3);
		this.bullet.graphics.beginFill('rgba(0, 92,112,0.2)');
		this.bullet.graphics.drawCircle(0,0,2);
		this.bullet.graphics.endStroke();
		this.bullet.shadow = new createjs.Shadow('#1bf43f', 0, 0, 10);
	};

	return Bullet;

})();
/*globals  Bullet:true */

var SpaceShip = (function(){

	var bullets = [];
	var bullet;
	var flameFlickerTimer = 0;
	// var lowestX = 10000;
	// var highestX = 0;
	// var lowestY = 10000;
	// var highestY = 0;
	var fullYOffset = 25;
	
	var enableFill = true;
	var rocketBody = [
		[85,11],
		[90,13],
		[101,24],
		[111,34],
		[118,48],
		[123,62],
		[124,75],
		[123,100],
		[120,125],
		[117,150],
		[114,160],
		[56,160],
		[52,150],
		[48,125],
		[46,100],
		[45,75],
		[46,62],
		[51,48],
		[57,34],
		[67,24],
		[80,13],
		[85,11]
	];

	var warpShieldBody = [
		[51*1.5,140*1.5],
		[21*1.5,145*1.5],
		[25*1.5,105*1.5],
		[35*1.5,82*1.5],
		[43*1.5,72*1.5],
		[46*1.5,62*1.5],
		[51*1.5,48*1.5],
		[57*1.5,34*1.5],
		[67*1.5,24*1.5],
		[80*1.5,13*1.5],
		[85*1.5,11*1.5],
		[85*1.5,11*1.5],
		[90*1.5,13*1.5],
		[101*1.5,24*1.5],
		[111*1.5,34*1.5],
		[118*1.5,48*1.5],
		[123*1.5,62*1.5],
		[126*1.5,72*1.5],
		[134*1.5,82*1.5],
		[144*1.5,105*1.5],
		[148*1.5,145*1.5],
		[118*1.5,140*1.5],
	];

	var rightWingBody = [
		[122,102],
		[130,109],
		[138,122],
		[144,135],
		[147,150],
		[148,166],
		[140,161],
		[128,156],
		[116,154]
	];

	var leftWingBody = [
		[122,102],
		[114,109],
		[106,122],
		[100,135],
		[97,150],
		[96,166],
		[104,161],
		[116,156],
		[128,154]
	];

	var smallFlameFactor = 0.5;
	var bigFlameFactor = 0.9;

	var smallFlameBody = [
		[148*smallFlameFactor,38*smallFlameFactor],
		[147*smallFlameFactor,54*smallFlameFactor],
		[144*smallFlameFactor,69*smallFlameFactor],
		[138*smallFlameFactor,82*smallFlameFactor],
		[130*smallFlameFactor,95*smallFlameFactor],		
		[122*smallFlameFactor,102*smallFlameFactor],
		[122*smallFlameFactor,102*smallFlameFactor],
		[114*smallFlameFactor,95*smallFlameFactor],
		[106*smallFlameFactor,82*smallFlameFactor],
		[100*smallFlameFactor,69*smallFlameFactor],
		[97*smallFlameFactor,54*smallFlameFactor],
		[96*smallFlameFactor,38*smallFlameFactor]	
	];

	var bigFlameBody = [
		[148*bigFlameFactor,38*bigFlameFactor],
		[147*bigFlameFactor,54*bigFlameFactor],
		[144*bigFlameFactor,69*bigFlameFactor],
		[138*bigFlameFactor,82*bigFlameFactor],
		[130*bigFlameFactor,95*bigFlameFactor],		
		[122*bigFlameFactor,102*bigFlameFactor],
		[122*bigFlameFactor,102*bigFlameFactor],
		[114*bigFlameFactor,95*bigFlameFactor],
		[106*bigFlameFactor,82*bigFlameFactor],
		[100*bigFlameFactor,69*bigFlameFactor],
		[97*bigFlameFactor,54*bigFlameFactor],
		[96*bigFlameFactor,38*bigFlameFactor]	
	];

	function SpaceShip(x, y, dead, crack){
		_.bindAll(this);
		this.x = x;
		this.y = y;
		this.velX = 0.05;
		this.speed = 5;
		this.friction = 0.8;
		this.shipWidth = 50;
		this.destinationPosition = 50;
		this.scaleFactor = 0.33;
		this.shipImmune = false;
		this.warpSpeed = false;
		this.shootMode = false;
		this.smallerMode = false;
		this.biggerMode = false;
		this.capableToFly = true;
		this.dead = dead;
		this.crack = crack;
		this.init();
	}

	SpaceShip.prototype.init = function() {
		this.ship = new createjs.Container();

		this.ship.x = this.x;
		this.ship.y = this.y;
		
		if (!this.dead) {
			this.drawFlames();
		}else{
			if (this.crack) {
				this.drawCrack();
			}else{
				this.drawWinningStripes();
			}
		}

		
		
		this.drawWindow();		
		this.drawCannon();
		this.drawWings();
		
		this.drawShip();		
		this.drawShield();

		this.ship.width = 60;
		this.ship.height = 60;
	};

	SpaceShip.prototype.drawShield = function(){
		this.warpShield = new createjs.Shape();

		this.warpShield.graphics.beginStroke('#00d2ff');
		this.warpShield.graphics.setStrokeStyle(2);
		if(enableFill) {this.warpShield.graphics.beginFill('rgba(0, 92,112,0.2)');}
		this.drawFromArray(this.warpShield, warpShieldBody, 0,-18+fullYOffset);
		if(enableFill) {this.warpShield.graphics.endFill();}

		this.warpShield.graphics.endStroke();
		this.warpShield.scaleX = this.warpShield.scaleY = 0;

		this.warpShield.shadow = new createjs.Shadow('#005c70', 0, 0, 3);

		//this.warpShield.scaleX = this.warpShield.scaleY = 1.5;

		this.ship.addChild(this.warpShield);
	};

	SpaceShip.prototype.drawCannon = function(){
		this.cannon = new createjs.Shape();

		this.cannon.graphics.beginStroke('#aef69d');
		this.cannon.graphics.setStrokeStyle(2);
		this.cannon.graphics.beginFill('rgba(0, 92,112,0.2)');

		this.cannon.graphics.moveTo(0*this.scaleFactor, -85*this.scaleFactor);
		this.cannon.graphics.lineTo(0*this.scaleFactor, -120*this.scaleFactor);

		this.cannon.graphics.moveTo(-55*this.scaleFactor, 15*this.scaleFactor);
		this.cannon.graphics.lineTo(-60*this.scaleFactor, -20*this.scaleFactor);

		this.cannon.graphics.moveTo(-67*this.scaleFactor, 35*this.scaleFactor);
		this.cannon.graphics.lineTo(-72*this.scaleFactor, 10*this.scaleFactor);

		this.cannon.graphics.moveTo(55*this.scaleFactor, 15*this.scaleFactor);
		this.cannon.graphics.lineTo(60*this.scaleFactor, -20*this.scaleFactor);

		this.cannon.graphics.moveTo(67*this.scaleFactor, 35*this.scaleFactor);
		this.cannon.graphics.lineTo(72*this.scaleFactor, 10*this.scaleFactor);

		this.cannon.graphics.endFill();

		this.cannon.graphics.endStroke();
		this.cannon.scaleX = this.cannon.scaleY = 0;

		this.cannon.shadow = new createjs.Shadow('#1bf43f', 0, 0, 3);
		this.ship.addChild(this.cannon);
	};

	SpaceShip.prototype.drawFlames = function(){
		this.smallFlame = new createjs.Shape();
		this.bigFlame = new createjs.Shape();

		this.smallFlame.graphics.beginStroke('#ffe400');
		if(enableFill) {this.smallFlame.graphics.beginFill('rgba(255, 228,0,0.08)');}
		this.smallFlame.graphics.setStrokeStyle(2);
		this.drawFromArray(this.smallFlame, smallFlameBody, 0,85+fullYOffset);
		if(enableFill) {this.smallFlame.graphics.endFill();}
		this.smallFlame.graphics.endStroke();

		this.bigFlame.graphics.beginStroke('#ff7200');
		this.bigFlame.graphics.setStrokeStyle(2);
		if(enableFill) {this.bigFlame.graphics.beginFill('rgba(255, 114,0,0.2)');}
		this.drawFromArray(this.bigFlame, bigFlameBody, 0,115+fullYOffset);
		if(enableFill) {this.bigFlame.graphics.endFill();}
		this.bigFlame.graphics.endStroke();

		this.smallFlame.shadow = new createjs.Shadow('#ffe400', 0, 0, 3);
		this.bigFlame.shadow = new createjs.Shadow('#ff7200', 0, 0, 3);

		this.ship.addChild(this.bigFlame);
		this.ship.addChild(this.smallFlame);
	};

	SpaceShip.prototype.drawWinningStripes = function(){
		var crack = new createjs.Shape();
		
		crack.graphics.beginStroke('#00d2ff');
		crack.graphics.setStrokeStyle(2);
		crack.graphics.moveTo(-35, 10);
		crack.graphics.lineTo(-85, 0);
		crack.graphics.moveTo(35, 10);
		crack.graphics.lineTo(85, 0);
		
		crack.graphics.beginStroke('#fff448');
		crack.graphics.moveTo(-30, 0);
		crack.graphics.lineTo(-65, -20);
		crack.graphics.moveTo(30, 0);
		crack.graphics.lineTo(65, -20);

		crack.graphics.beginStroke('#00d2ff');
		crack.graphics.moveTo(-23, -10);
		crack.graphics.lineTo(-40, -30);
		crack.graphics.moveTo(23, -10);
		crack.graphics.lineTo(40, -30);

		crack.graphics.beginStroke('#fff448');
		crack.graphics.moveTo(-15, -23);
		crack.graphics.lineTo(-18, -30);
		crack.graphics.moveTo(15, -23);
		crack.graphics.lineTo(18, -30);

		this.ship.addChild(crack);
		crack.shadow = new createjs.Shadow('#00ADEE', 0, 0, 10);
	};

	SpaceShip.prototype.drawCrack = function() {
		var crack = new createjs.Shape();
		crack.graphics.beginStroke('#ffffff');
		crack.graphics.setStrokeStyle(2);
		crack.graphics.moveTo(12, 12);
		crack.graphics.lineTo(2,5);
		crack.graphics.lineTo(4,12);
		crack.graphics.lineTo(-6,8);
		this.ship.addChild(crack);
		crack.shadow = new createjs.Shadow('#00ADEE', 0, 0, 10);
	};

	SpaceShip.prototype.drawWings = function(){
		this.leftWing = new createjs.Shape();
		this.rightWing = new createjs.Shape();

		this.rightWing.graphics.beginStroke('#d17c7c');
		if(enableFill) {this.rightWing.graphics.beginFill('rgba(255,0,0,0.2)');}
		this.rightWing.graphics.setStrokeStyle(2);
		this.drawFromArray(this.rightWing, rightWingBody, 50,14+fullYOffset);
		this.rightWing.graphics.endStroke();
		if(enableFill) {this.rightWing.graphics.endFill();}

		this.leftWing.graphics.beginStroke('#d17c7c');
		if(enableFill) {this.leftWing.graphics.beginFill('rgba(255,0,0,0.2)');}
		this.leftWing.graphics.setStrokeStyle(2);
		this.drawFromArray(this.leftWing, leftWingBody,-50,-5+fullYOffset);
		this.leftWing.graphics.endStroke();
		if(enableFill) {this.leftWing.graphics.endFill();}
		this.leftWing.shadow = this.rightWing.shadow = new createjs.Shadow('#d83232', 0, 0, 10);

		this.ship.addChild(this.leftWing);
		this.ship.addChild(this.rightWing);
	};

	SpaceShip.prototype.drawWindow = function(){
		this.shipWindow = new createjs.Shape();

		this.shipWindow.graphics.beginStroke('#47a4da');
		this.shipWindow.graphics.setStrokeStyle(2);
		this.shipWindow.graphics.drawCircle(0,(fullYOffset-58)*this.scaleFactor,17*this.scaleFactor);
		this.shipWindow.graphics.endStroke();

		this.shipWindow.shadow = new createjs.Shadow('#47a4da', 0, 0, 3);

		this.ship.addChild(this.shipWindow);
	};

	SpaceShip.prototype.drawShip = function() {
		this.shipBody = new createjs.Shape();

		this.shipBody.graphics.beginStroke('#ffffff');
		this.shipBody.graphics.setStrokeStyle(2);
		if(enableFill) {this.shipBody.graphics.beginFill('rgba(255,255,255,0.08)');}

		this.drawFromArray(this.shipBody, rocketBody, 0,fullYOffset);

		if(enableFill) {this.shipBody.graphics.endFill();}
		this.shipBody.graphics.endStroke();
		
		// debug circles	
		// this.shipBody.graphics.beginFill('rgba(255,0,0,0.5)');
		// this.shipBody.graphics.drawCircle(0,0, 30);
		// this.shipBody.graphics.endFill();

		// this.shipBody.graphics.beginFill('rgba(255,0,0,1)');
		// this.shipBody.graphics.drawCircle(0,0, 3);
		// this.shipBody.graphics.endFill();

		this.shipBody.shadow = new createjs.Shadow('#00ADEE', 0, 0, 10);

		this.ship.addChild(this.shipBody);
	};

	SpaceShip.prototype.drawFromArray = function(shape, shapeArray, xOffset, yOffset){
		var shapeWidthMin = 10000;
		var shapeWidthMax = 0;
		var shapeHeightMin = 10000;
		var shapeHeightMax = 0;


		for (var i = 0; i < shapeArray.length; i++) {
			shapeWidthMin = Math.min(shapeWidthMin, shapeArray[i][0]);
			shapeWidthMax = Math.max(shapeWidthMax, shapeArray[i][0]);
			shapeHeightMin = Math.min(shapeHeightMin, shapeArray[i][1]);
			shapeHeightMax = Math.max(shapeHeightMax, shapeArray[i][1]);
		}

		shape.width = shapeWidthMax - shapeWidthMin;
		shape.height = shapeHeightMax - shapeHeightMin;

		var horizontalOffset = Math.abs(((shapeWidthMax- shapeWidthMin)/2) + shapeWidthMin);
		var verticalOffset = Math.abs(((shapeHeightMax - shapeHeightMin)/2) + shapeWidthMin);

		//horizontalOffset = verticalOffset = 0;

		for (var j = 0; j < shapeArray.length; j++) {
			var xPos = ((shapeArray[j][0] - horizontalOffset)*this.scaleFactor)+(xOffset*this.scaleFactor);

			// lowestX = Math.min(lowestX, xPos);
			// highestX = Math.max(highestX, xPos);

			var yPos = ((shapeArray[j][1] - verticalOffset)*this.scaleFactor)+(yOffset*this.scaleFactor);

			// lowestY = Math.min(lowestY, yPos);
			// highestY = Math.max(highestY, yPos);

			if (j === 0){
				shape.graphics.moveTo(xPos, yPos);	
			}else{
				shape.graphics.lineTo(xPos, yPos);
			}
		}
	};

	SpaceShip.prototype.reset = function(){
		this.destinationPosition = 50;
		var destinationXpos = ($('#cnvs').width() - this.shipWidth) * this.destinationPosition / 100;
		this.x = (this.shipWidth/2) + destinationXpos;
		this.ship.x = this.x;
		this.ship.alpha = 0;
		this.ship.scaleX = this.ship.scaleY = 1;
		this.ship.y = this.y = $('#cnvs').height() *(1-0.1313);
		this.ship.rotation = 0;
		this.capableToFly = true;
		this.warpSpeed = false;
		this.shootMode = false;
		this.ship.alpha = 0;
		this.warpShield.scaleX = this.warpShield.scaleY = 0;
		this.cannon.scaleX = this.cannon.scaleY = 0;
	};

	SpaceShip.prototype.gotShot = function(){
		this.capableToFly = false;
	};

	SpaceShip.prototype.update = function() {

		if (this.capableToFly) {
			//ease to position;
			//destinatonpos between 0 and 100
			this.destinationPosition = Math.min(Math.max(0, this.destinationPosition), 100);

			var destinationXpos = ($('#cnvs').width() - this.shipWidth) * this.destinationPosition / 100;
			this.x = (this.shipWidth/2) + destinationXpos;
			this.ship.x += (this.x-this.ship.x)* this.velX;

			this.ship.rotation = (this.x-this.ship.x)*0.1;

			//big flame on when ship angle bigger than 3
			var rotationOffset = 3;
			if (Math.abs(this.ship.rotation) > rotationOffset) {
				this.bigFlame.alpha = (Math.abs(this.ship.rotation)-rotationOffset)/3;
			}else{
				this.bigFlame.alpha = 0;
			}
			
			if (flameFlickerTimer === 5) {
				flameFlickerTimer = 0;
				this.smallFlame.alpha = 0.3 + Math.random()*0.7;
				this.bigFlame.alpha *= 0.5 + Math.random()*0.5;
			}

			if (this.shipImmune) {
				//this.warpShield.alpha = 1;
				this.warpShield.scaleX = this.warpShield.scaleY += (1-this.warpShield.scaleX)*0.2;
			}else{
				this.warpShield.scaleX = this.warpShield.scaleY += (0-this.warpShield.scaleX)*0.2;
				//this.warpShield.alpha = 0;
			}

			if (this.shootMode) {
				this.cannon.scaleX = this.cannon.scaleY += (1-this.cannon.scaleX)*0.2;
			}else{
				this.cannon.scaleX = this.cannon.scaleY += (0-this.cannon.scaleX)*0.2;
			}

			if (this.smallerMode) {
				this.ship.scaleX = this.ship.scaleY += (0.3-this.ship.scaleX)*0.05;
			}else{
				this.ship.scaleX = this.ship.scaleY += (1-this.ship.scaleX)*0.05;
			}

			if (this.biggerMode) {
				this.ship.scaleX = this.ship.scaleY += (1.8 - this.ship.scaleX)*0.05;
			}else{
				this.ship.scaleX = this.ship.scaleY += (1-this.ship.scaleX)*0.05;
			}

			this.ship.width = 60 * this.ship.scaleX;
			this.ship.height = 60 * this.ship.scaleY;

			flameFlickerTimer++;

			var backgroundPos = Math.round((this.ship.x/26)*10)/10;
			
			$('body').css('background-position-x', (backgroundPos)+'px');
			$('#container').css('background-position-x', (backgroundPos*2)+'px');
		}else{

			if (this.ship.y < $('#cnvs').height() + 100 ){
				this.ship.y += 4;
				this.ship.scaleY = this.ship.scaleX += (0 - this.ship.scaleX) * 0.1;
				this.ship.x += 1;
				if (this.destinationPosition < 50) {
					this.ship.rotation += 10;
				}else{
					this.ship.rotation -= 10;
				}
			}else{
				bean.fire(this, 'stopGame');
			}	
		}
	};

	return SpaceShip;

})();	
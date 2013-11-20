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

	function SpaceShip(x, y){
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
	}

	SpaceShip.prototype.init = function() {
		this.ship = new createjs.Container();

		this.ship.x = this.x;
		this.ship.y = this.y;
		
		this.drawFlames();
		this.drawWindow();		
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
		//= new createjs.Shadow('#00ADEE', 0, 0, 10);

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

		this.ship.rotation = 0;
	};

	SpaceShip.prototype.update = function() {

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

		flameFlickerTimer++;
		
		$('body').css('background-position-x', (this.ship.x/26)+'px');
		$('#container').css('background-position-x', (this.ship.x/13)+'px');

	};


	return SpaceShip;

})();	
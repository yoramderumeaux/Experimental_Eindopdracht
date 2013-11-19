(function(){

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

var CanvasSetup = (function(){

	var canvasHeight, canvasWidth;
	var aspectRatio;

	function CanvasSetup($canvasElement, ratio) {
		_.bindAll(this);
		this.$canvasElement = $canvasElement;
		aspectRatio = ratio;
	}

	CanvasSetup.prototype.init = function() {
		canvasHeight = $('body').height();
		canvasWidth = canvasHeight/aspectRatio;
		this.$canvasElement.css('width', canvasWidth);
	};


	return CanvasSetup;

})();

var CollisionDetection = (function(){

	function CollisionDetection() {

	}

	CollisionDetection.checkCollisionCenterAnchor = function(shapeA, shapeB) {
		//console.log(shapeA.height);

		var vX = shapeA.x - shapeB.x;
		var vY = shapeA.y - shapeB.y;

		var hWidths = (shapeA.width/2) + (shapeB.width/2);	
		var hHeight = (shapeA.height/2) + (shapeB.height/2);

		// Collision
		if(Math.abs(vX) < hWidths && Math.abs(vY) < hHeight) {
			return 'hit';	
		}

		return 'noHit';

	};

	CollisionDetection.sayHello = function(){
		console.log('say hello');
	};

	return CollisionDetection;

})();

/* globals CanvasSetup:true, SpaceShip:true, Timer:true, Meteorite:true, SocketConnection:true, Bullet:true, CollisionDetection:true */

var Main = (function(){

	var stage, ticker, keys;
	var spaceShip, timer, meteorite, meteorites, bullet;
	var meteorTimer;
	var socketConnection;
	var collisionDetection;
	var activeWindow = true;
	var enableNewMeteorites = true;
	var meteoriteColumns = 0;
	var backgroundPos = 0;
	var bulletFired = false;
	var bulletBurstNumber = 3;
	var currentBurst = 0;

	var bullets = [];

	function Main($sourceElement) {
		_.bindAll(this);
		this.$sourceElement = $sourceElement;

		keys = [];
		meteorites = [];
	}

	Main.prototype.init = function() {
		// Setup canvas and Stageobject
		this.setupStage();
		var self = this;

		socketConnection = new SocketConnection();
		socketConnection.init();

		meteoriteColumns = Math.floor($('#cnvs').width() / 70);

		// Usercontrolable SpaceShip
		var midX = ($('#cnvs').width()/2);
		var bottomY = $('#cnvs').height() *(1-0.1313);

		spaceShip = new SpaceShip(midX, bottomY);
		spaceShip.init();

		// Timer for new Meteorite
		this.newMeteorite();
		meteorTimer = setInterval(this.newMeteorite, 1000);

		// Start the timer for the game
		timer = new Timer();
		timer.start();

		// KeyboardEvents
		window.onkeyup = this.keyup;
		window.onkeydown = this.keydown;

		// StageTicker
		ticker = createjs.Ticker;
		ticker.setFPS(60);
		ticker.addEventListener('tick', this.update);

		// Add objects to stage
		stage.addChild(spaceShip.ship);

		bean.on(socketConnection, 'jump', this.jumpHandler);
		bean.on(socketConnection, 'horizontalPosition', function(data){
			if (spaceShip) {
				spaceShip.destinationPosition = data;
				//console.log(data);
			}
		});
		bean.on(timer, 'endTimer', function(){
			enableNewMeteorites = false;
		});

		//disable timer bug on window blur
		$(window).focus(function() {
			//continue timer
			activeWindow = true;
		});

		$(window).blur(function() {
			//pause timer
			activeWindow = false;
		});

		setTimeout(function(){
			self.togglePowerUpWarp(true);
		}, 5000);

		setTimeout(function(){
			self.togglePowerUpWarp(false);
		}, 10000);
		
	};

	Main.prototype.togglePowerUpWarp = function(enablePowerUp){
		if (enablePowerUp) {
			clearInterval(meteorTimer);
			meteorTimer = setInterval(this.newMeteorite, 100);

			for (var i = 0; i < meteorites.length; i++) {
				meteorites[i].speedFactor = 50;
			}

		}else{
			clearInterval(meteorTimer);
			meteorTimer = setInterval(this.newMeteorite, 1000);

			for (var j = 0; j < meteorites.length; j++) {
				meteorites[j].speedFactor = 1;
			}
		}
	};

	Main.prototype.jumpHandler = function(){
		console.log('jump met bean');
	};

	Main.prototype.update = function() {
		// Uiteindelijk vervangen door waarden van sensor..
		// if value < 50 naar rechts...
		// ook Speed aanpassen als je meer dan 75 hebt bijvoorbeeld

		backgroundPos += 0.5;
		$('body').css('background-position-y', (backgroundPos/2)+'px');
		$('#container').css('background-position-y', (backgroundPos)+'px');

		// Links
		if(keys[37]) {
			spaceShip.destinationPosition -= 2;
		}

		// Rechts
		if(keys[39]) {
			spaceShip.destinationPosition += 2;
		}

		if (keys[32]) {		
			if (!bulletFired) {
				bulletFired = true;

				var bullet = new Bullet();
				bullet.init();
				bullet.directionAngle = spaceShip.ship.rotation;
				bullet.bullet.x = spaceShip.ship.x;
				bullet.bullet.y = spaceShip.ship.y- 25;

				bullets.push(bullet);

				stage.addChild(bullet.bullet);

				/*window.setTimeout(function(){
					console.log('new bullet ready');
					bulletFired = false;
				}, 1000);*/
			}
		}else{
			bulletFired = false;
		}

		// Update the meteorite
		if( meteorites.length > 0 ) {
			for (var i = 0; i < meteorites.length; i++) {
				meteorites[i].velY = 0.1;

				if ($('#cnvs').height() + 150 < meteorites[i].y) {
					meteorites[i] = null;					
					meteorites.splice(i, 1);		
				}else{
					meteorites[i].update();
				}
			}
		}

		if( bullets.length > 0){
			for (var j = 0; j < bullets.length; j++) {

				if (bullets[j].bullet.x < -30 || bullets[j].bullet.x > $('#cnvs').width()+30 || bullets[j].bullet.y < -30) {
					bullets[j] = null;					
					bullets.splice(j, 1);			
				}else{
					//meteorites[i].update();
					bullets[j].bullet.y -= 10;
					var radians = ((-90 +bullets[j].directionAngle) * Math.PI)/180;	

					bullets[j].bullet.x += (30 * Math.cos(radians));
				}

				//bullets[j].bullet.x -= 20 * Math.cos(bullets[j].directionAngle);
				//console.log(20 * Math.cos(bullets[j].directionAngle));
			}
		}

		//check for collision
		for (var k = 0; k < meteorites.length; k++) {
			if (!spaceShip.shipImmune) {
				if(CollisionDetection.checkCollisionCenterAnchor(spaceShip.ship, meteorites[k].meteorite) === 'hit'){
					this.restartGame();
				}
			}

			for (var l = 0; l < bullets.length; l++) {

				if(CollisionDetection.checkCollisionCenterAnchor(bullets[l].bullet, meteorites[k].meteorite) === 'hit'){
					$('#timer p').html('Bam');

					stage.removeChild(meteorites[k].meteorite);
					stage.removeChild(bullets[l].bullet);

					bullets[l] = null;
					bullets.splice(l, 1);

					meteorites[k] = null;					
					meteorites.splice(k, 1);
					return false;
				}
			}
		}

		spaceShip.update();
		stage.update();
	};

	Main.prototype.restartGame = function(){
		for (var j = 0; j < bullets.length; j++) {
			stage.removeChild(bullets[j].bullet);
			bullets[j] = null;
		}

		bullets = [];

		for (var k = 0; k < meteorites.length; k++) {
			stage.removeChild(meteorites[k].meteorite);
			meteorites[k] = null;
		}

		meteorites = [];

		timer.restart();

		spaceShip.reset();
	};

	Main.prototype.keyup = function(e) {
		keys[e.keyCode] = false;
	};

	Main.prototype.keydown = function(e) {
		keys[e.keyCode] = true;
	};

	Main.prototype.newMeteorite = function() {		
		if (activeWindow && enableNewMeteorites) {
			if (Math.round(Math.random()*3) > 0) {
				var randomX = Math.random()*($('#cnvs').width());
				// var randomXColumn = Math.round(Math.random()*(meteoriteColumns*2));
				// console.log(randomXColumn);
				// var randomX = (($('#cnvs').width() - 70)/(meteoriteColumns*2))*randomXColumn;

				meteorite = new Meteorite(randomX, -100);
				meteorite.init();
				meteorite.speedFactor = 1;

				meteorites.push(meteorite);
				stage.addChild(meteorite.meteorite);
			}
		}
	};

	Main.prototype.setupStage = function() {
		// Make a new stageobject
		stage = new createjs.Stage('cnvs');

		// Setup canvas size and scale stage appropriatly
		var ratio = 1.41;
		var canvasSetup = new CanvasSetup($('#cnvs'), ratio);
		canvasSetup.init();

		stage.canvas.height = $('body').height();
		stage.canvas.width = $('body').height()/ratio;
	};

	return Main;

})();

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
		this.rotationDirection = -1 + 2*(Math.random());
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
		//this.meteorite.graphics.drawRect(-30,-30,60,60);
		//this.meteorite.graphics.drawRect(-20,-20,40,40);

		// this.meteorite.graphics.beginFill("#ff0000");
		// this.meteorite.graphics.drawCircle(0,0,(this.meteorite.width + this.meteorite.height)/4);
		// this.meteorite.graphics.endFill();
		
		this.meteorite.shadow = new createjs.Shadow('#ce4b1d', 0, 0, 5);
	};

	Meteorite.prototype.update = function() {
		this.speed = (10+ Math.round(Math.random()*20)) * this.speedFactor;

		this.y += this.velY * this.speed;
		this.meteorite.y = this.y;
		this.meteorite.rotation += (this.rotationDirection * (this.speed)/40);
		//this.meteorite.rotation += 30;
		this.velY *= this.gravity;

		//this.meteorite.y = this.y = 200;
	};


	return Meteorite;

})();

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

/*globals io:true */

var SocketConnection = (function(){

	function SocketConnection() {
		_.bindAll(this);
	}

	SocketConnection.prototype.init = function() {
		var socket = io.connect(':1337');

		var self = this;
		
		socket.on('horizontalPosition', function(data) {
			bean.fire(self, 'horizontalPosition', data);
		});

		socket.on('jump', function(data) {
			if (data) {
				bean.fire(self, 'jump');
			}
		});
	};

	return SocketConnection;
})();

/*globals  Bullet:true */

var SpaceShip = (function(){

	var bullets = [];
	var bullet;
	var flameFlickerTimer = 0;
	var lowestX = 10000;
	var highestX = 0;
	var lowestY = 10000;
	var highestY = 0;
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
	}

	SpaceShip.prototype.init = function() {
		this.ship = new createjs.Container();

		this.ship.x = this.x;
		this.ship.y = this.y;
		
		this.drawFlames();
		this.drawWindow();		
		this.drawWings();
		this.drawShip();		

		this.ship.width = highestX - lowestX;
		this.ship.height = highestY - lowestY;
	};

	SpaceShip.prototype.drawFlames = function(){
		this.smallFlame = new createjs.Shape();
		this.bigFlame = new createjs.Shape();

		this.smallFlame.graphics.beginStroke('#ffe400');
		if(enableFill) {this.smallFlame.graphics.beginFill('rgba(255, 228,0,0.08)');}
		this.smallFlame.graphics.setStrokeStyle(2);
		this.drawFromArray(this.smallFlame, smallFlameBody, 0,85);
		if(enableFill) {this.smallFlame.graphics.endFill();}
		this.smallFlame.graphics.endStroke();

		this.bigFlame.graphics.beginStroke('#ff7200');
		this.bigFlame.graphics.setStrokeStyle(2);
		if(enableFill) {this.bigFlame.graphics.beginFill('rgba(255, 114,0,0.2)');}
		this.drawFromArray(this.bigFlame, bigFlameBody, 0,115);
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
		this.drawFromArray(this.rightWing, rightWingBody, 50,14);
		this.rightWing.graphics.endStroke();
		if(enableFill) {this.rightWing.graphics.endFill();}

		

		this.leftWing.graphics.beginStroke('#d17c7c');
		if(enableFill) {this.leftWing.graphics.beginFill('rgba(255,0,0,0.2)');}
		this.leftWing.graphics.setStrokeStyle(2);
		this.drawFromArray(this.leftWing, leftWingBody,-50,-5);
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
		this.shipWindow.graphics.drawCircle(0,-58*this.scaleFactor,17*this.scaleFactor);
		this.shipWindow.graphics.endStroke();

		this.shipWindow.shadow = new createjs.Shadow('#47a4da', 0, 0, 3);

		this.ship.addChild(this.shipWindow);
	};

	SpaceShip.prototype.drawShip = function() {
		this.shipBody = new createjs.Shape();

		this.shipBody.graphics.beginStroke('#ffffff');
		this.shipBody.graphics.setStrokeStyle(2);
		if(enableFill) {this.shipBody.graphics.beginFill('rgba(255,255,255,0.08)');}

		this.drawFromArray(this.shipBody, rocketBody, 0,0);

		if(enableFill) {this.shipBody.graphics.endFill();}
		this.shipBody.graphics.endStroke();
	

		// this.shipBody.graphics.beginFill('#ff0000');
		// this.shipBody.graphics.drawCircle(0,0, 1);
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

			lowestX = Math.min(lowestX, xPos);
			highestX = Math.max(highestX, xPos);

			var yPos = ((shapeArray[j][1] - verticalOffset)*this.scaleFactor)+(yOffset*this.scaleFactor);

			lowestY = Math.min(lowestY, yPos);
			highestY = Math.max(highestY, yPos);

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

		this.ship.rotation = (this.x-this.ship.x)*0.1;
	};

	SpaceShip.prototype.update = function() {

		//ease to position;
		//destinatonpos between 0 and 100
		this.destinationPosition = Math.min(Math.max(0, this.destinationPosition), 100);

		var destinationXpos = ($('#cnvs').width() - this.shipWidth) * this.destinationPosition / 100;
		this.x = (this.shipWidth/2) + destinationXpos;
		this.ship.x += (this.x-this.ship.x)* this.velX;

		this.ship.rotation = (this.x-this.ship.x)*0.1;

		this.bigFlame.alpha = Math.abs(this.ship.rotation)/3;
		
		if (flameFlickerTimer === 5) {
			flameFlickerTimer = 0;
			this.smallFlame.alpha = 0.3 + Math.random()*0.7;
			this.bigFlame.alpha *= 0.5 + Math.random()*0.5;
		}

		flameFlickerTimer++;
		
		$('body').css('background-position-x', (this.ship.x/26)+'px');
		$('#container').css('background-position-x', (this.ship.x/13)+'px');

		//ease in out
		// this.x += this.velX;
		// this.ship.x = this.x;
		// this.velX *= this.friction;

		// if (this.ship.x < this.shipWidth/2) {
		// console.log('limit left');
		// this.x = this.ship.x = this.shipWidth/2;
		// }else if(this.ship.x > ($('#cnvs').width() - (this.shipWidth/2)))	{
		// this.x = this.ship.x = $('#cnvs').width() - (this.shipWidth/2);
		// console.log('limit right');
		// }else{
		// this.x += this.velX;
		// this.ship.x = this.x;
		// this.velX *= this.friction;
		// }

		//console.log(this.x);
			
	};


	return SpaceShip;

})();	

var Timer = (function(){

	var myTimer;

	function Timer() {
		_.bindAll(this);
		this.timer = 60;

		// Set the startTime
		//$('#timer p').html(this.timer);
	}

	Timer.prototype.start = function() {
		myTimer =  setInterval(this.update, 1000);
	};

	Timer.prototype.stop = function() {
		clearInterval(myTimer);
	};

	Timer.prototype.restart = function(){
		this.timer = 60;
		this.update();
	};

	Timer.prototype.update = function() {
		
		$('#timer p').html(this.timer);

		if(this.timer === 0) {
			this.stop();
			bean.fire(this, 'endTimer');
		}

		this.timer --;
	};

	return Timer;

})();

/* globals Main:true */

var main = new Main($('#container'));
main.init();

})();
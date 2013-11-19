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
	var backgroundSpeed = 0.5;
	var gameSpeedFactor = 1;
	var meteoriteTimerValue = 1500;

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
		meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue);

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
			}
		});

		bean.on(timer, 'endTimer', function(){
			//enableNewMeteorites = false;
			self.restartGame();
		});

		bean.on(timer, 'speedUpMeteorites', this.speedUpMeteoriteTimer);

		//disable timer bug on window blur
		$(window).focus(function() {
			//continue timer
			activeWindow = true;
		});

		$(window).blur(function() {
			//pause timer
			activeWindow = false;
		});

		//this.togglePowerUpWarp(true);
	};

	Main.prototype.togglePowerUpWarp = function(enablePowerUp){
		if (enablePowerUp) {
			// clear timer and restart faster
			clearInterval(meteorTimer);
			meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue/10);
			spaceShip.warpSpeed = true;
			spaceShip.shipImmune = true;

			// enable warp speed on all visible meteorites
			for (var i = 0; i < meteorites.length; i++) {
				meteorites[i].enableWarpSpeed = true;
			}

		}else{
			// clear timer and restart at normal speed
			clearInterval(meteorTimer);
			meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue);
			spaceShip.warpSpeed = false;
		}
	};

	Main.prototype.jumpHandler = function(){
		// Jump detected
		console.log('jump met bean');
	};


	Main.prototype.speedUpMeteoriteTimer = function(){
		console.log('faster!');
		meteoriteTimerValue -= 300;
		clearInterval(meteorTimer);
		if (spaceShip.warpSpeed) {
			meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue/10);
		}else{
			meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue);	
		}
	};

	Main.prototype.resetMeteoriteTimer = function(){
		clearInterval(meteorTimer);
		meteoriteTimerValue = 1500;
		meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue);
	};

	Main.prototype.update = function() {

		this.cleanMeteorites();

		//set background speed
		if (!spaceShip.warpSpeed) {
			backgroundSpeed += (0.5 - backgroundSpeed) * 0.05;
		}else{
			backgroundSpeed += (5 - backgroundSpeed) * 0.05;
		}

		backgroundPos += (backgroundSpeed*gameSpeedFactor);

		$('body').css('background-position-y', (backgroundPos/2)+'px');
		$('#container').css('background-position-y', (backgroundPos)+'px');

		// Use arrows as debug controls
		//	left
		if(keys[37]) {
			spaceShip.destinationPosition -= 2;
		}

		//	Right
		if(keys[39]) {
			spaceShip.destinationPosition += 2;
		}

		//	Space to shoot
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
			}
		}else{
			bulletFired = false;
		}

		// Update all meteorites
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

		// Update all bullets
		if( bullets.length > 0){
			for (var j = 0; j < bullets.length; j++) {

				if (bullets[j].bullet.x < -30 || bullets[j].bullet.x > $('#cnvs').width()+30 || bullets[j].bullet.y < -30) {
					bullets[j] = null;					
					bullets.splice(j, 1);			
				}else{
					bullets[j].bullet.y -= 10;
					var radians = ((-90 +bullets[j].directionAngle) * Math.PI)/180;	
					bullets[j].bullet.x += (30 * Math.cos(radians));
				}
			}
		}

		// Check for collision between the ship and meteorites, and between bullets and meteorites
		for (var k = 0; k < meteorites.length; k++) {
			if (!spaceShip.shipImmune) {
				if(CollisionDetection.checkCollisionCenterAnchor(spaceShip.ship, meteorites[k].meteorite) === 'hit'){
					// Ship crashed into a meteorite
					if (meteorites[k].canDoDamage) {
						this.restartGame();
					}
				}
			}

			for (var l = 0; l < bullets.length; l++) {

				if(CollisionDetection.checkCollisionCenterAnchor(bullets[l].bullet, meteorites[k].meteorite) === 'hit'){
					// A bullet hit a meteorite
					//$('#timer p').html('Bam');
					if (meteorites[k].canDoDamage) {
						meteorites[k].gotShot();

						stage.removeChild(bullets[l].bullet);

						bullets[l] = null;
						bullets.splice(l, 1);						
						
						return false;
					}
				}
			}
		}

		spaceShip.update();
		stage.update();
	};

	Main.prototype.restartGame = function(){
		timer.stop();
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
		gameSpeedFactor = 1;
		this.resetMeteoriteTimer();
		spaceShip.reset();

		timer.start();

		
	};

	Main.prototype.keyup = function(e) {
		keys[e.keyCode] = false;
	};

	Main.prototype.keydown = function(e) {
		keys[e.keyCode] = true;
	};

	Main.prototype.cleanMeteorites = function(){

		for (var i = 0; i < meteorites.length; i++) {
			if(meteorites[i].readyToRemove){
				stage.removeChild(meteorites[i].meteorite);
				meteorites[i] = null;					
				meteorites.splice(i, 1);
			}
		}
		
	};

	Main.prototype.newMeteorite = function() {		
		if (activeWindow && enableNewMeteorites) {



			if (Math.round(Math.random()*3) > 0) {
				var randomX = Math.random()*($('#cnvs').width());
				// var randomXColumn = Math.round(Math.random()*(meteoriteColumns*2));
				// console.log(randomXColumn);
				// var randomX = (($('#cnvs').width() - 70)/(meteoriteColumns*2))*randomXColumn;

				meteorite = new Meteorite(randomX, -100);

				meteorite.speedFactor = gameSpeedFactor;

				meteorite.init();

				if (spaceShip.warpSpeed) {
					meteorite.enableWarpSpeed = true;

				}else{
					meteorite.enableWarpSpeed = false;
					spaceShip.shipImmune = false;
				}

				meteorites.push(meteorite);
				stage.addChild(meteorite.meteorite);
			}

			gameSpeedFactor += 0.1;
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
/* globals CanvasSetup:true, SpaceShip:true, Timer:true, Meteorite:true, Score:true, PowerupProgress:true, StartScreen:true, Powerup:true, SocketConnection:true, Bullet:true, CollisionDetection:true, Sound:true, EndScreen:true */

var Main = (function(){

	var stage, ticker, keys;
	var spaceShip, timer, meteorite, powerupProgress, powerup, meteorites, bullet, sound, endScreen, startScreen;
	var meteorTimer;
	var powerupTimer;
	var socketConnection;
	var score;
	var collisionDetection;
	var enableNewMeteorites = true;
	var backgroundPos = 0;
	var bulletFired = false;
	var bulletBurstNumber = 3;
	var currentBurst = 0;
	var backgroundSpeed = 0.5;
	var gameSpeedFactor = 1;
	var powerUpActive = false;
	var defaultMeteoriteTimerValue = 1500;
	var meteoriteTimerValue = defaultMeteoriteTimerValue;
	var defaultPowerupTimerValue = 2000;
	var powerupTimerValue = defaultPowerupTimerValue;
	var debugKeyboardControl = false;
	var bulletCounter = 0;
	var reversedControls = false;
	var preventGameFromStopping = false;
	var weigthFactor = 1.1;

	var bullets = [];
	var powerups = [];

	function Main($sourceElement) {
		_.bindAll(this);
		this.$sourceElement = $sourceElement;

		keys = [];
		meteorites = [];
	}

	Main.prototype.init = function() {
		// Setup canvas and Stageobject
		this.setupStage();

		socketConnection = new SocketConnection();
		socketConnection.init();

		//wait for response of server
		bean.on(socketConnection, 'connectionOk', this.connectionOk);
		bean.on(socketConnection, 'cancelConnection', this.cancelConnection);
	};

	Main.prototype.connectionOk = function(){

		console.log('[MAIN] connection ok');
		var self = this;
		$('body').addClass('connected');

		// sound init
		sound = new Sound();
		//sound.playBackgroundMusic("BackgroundMusic_EXD");
		sound.playBackgroundMusic("backgroundmusictest");
		sound.playRocketSound("rocket");

		// spaceShip init
		var midX = ($('#cnvs').width()/2);
		var bottomY = $('#cnvs').height() *(1-0.1313);
		spaceShip = new SpaceShip(midX, bottomY);

		// game timer init
		timer = new Timer();	

		// score init
		score = new Score();

		powerupProgress = new PowerupProgress();

		// KeyboardEvents
		window.onkeyup = this.keyup;
		window.onkeydown = this.keydown;

		// Bean events
		bean.on(spaceShip, 'stopGame', this.stopGame);

		bean.on(socketConnection, 'jump', this.jumpHandler);

		$(document).on('click', '#mute', function(event) {
			event.preventDefault();
			sound.toggleMute();			
		});

		bean.on(socketConnection, 'horizontalPosition', function(data){

			data = data + ((data - 50) * weigthFactor );
			data = Math.min(100, data);
			data = Math.max(0, data);

			if (spaceShip && !debugKeyboardControl) {
				if( !reversedControls ) {
					spaceShip.destinationPosition = data;
				}else {
					spaceShip.destinationPosition = 100 - data;
				}
			}
		});

		bean.on(timer, 'endTimer', function(){
			if( !preventGameFromStopping ) {
				self.stopGame();	
			}
		});

		bean.on(timer, 'secondPast', this.speedUpGame);

		bean.on(timer, 'speedUpMeteorites', this.speedUpMeteoriteTimer);

		// StageTicker
		ticker = createjs.Ticker;
		ticker.setFPS(60);
		ticker.addEventListener('tick', this.update);

		startScreen = new StartScreen();
		stage.addChild(startScreen.startContainer);
		stage.update();
	};

	Main.prototype.togglePowerUpWarp = function(enablePowerUp){
		var self = this;

		if (enablePowerUp) {
			// Play soundeffect
			score.updateScore(250);

			console.log(timer.timer);

			if (timer.timer < 4) {
				preventGameFromStopping = true;	
			}
			
			sound.playEffectWithVolume('WarpSpeed', 100);

			// clear timer and restart faster
			clearInterval(meteorTimer);
			meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue/10);
			spaceShip.warpSpeed = true;
			spaceShip.shipImmune = true;

			// enable warp speed on all visible meteorites
			for (var i = 0; i < meteorites.length; i++) {
				meteorites[i].enableWarpSpeed = true;
			}

			powerupProgress.beginWarpProgress(4000);

			setTimeout(function(){
				self.togglePowerUpWarp(false);
			}, 3000);

		}else{
			// clear timer and restart at normal speed
			powerUpActive = false;
			clearInterval(meteorTimer);
			meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue);
			spaceShip.warpSpeed = false;

			if( preventGameFromStopping ) {
				setTimeout(function(){
					preventGameFromStopping = false;
					self.stopGame();
				}, 1300);
			}
		}
	};

	Main.prototype.togglePowerupShoot = function(enablePowerUp){
		if (enablePowerUp) {
			spaceShip.shootMode = true;

			var self = this;
			score.updateScore(250);

			powerupProgress.beginShootProgress(5000);

			setTimeout(function(){
				self.togglePowerupShoot(false);
			}, 5000);

		}else{
			powerUpActive = false;
			spaceShip.shootMode = false;
		}
	};

	Main.prototype.togglePowerUpReverse = function(enablePowerUp) {
		if (enablePowerUp) {
			var self = this;
			score.updateScore(250);

			reversedControls = true;
			powerupProgress.beginReverseProgress(4000);

			setTimeout(function(){
				self.togglePowerUpReverse(false);
			}, 4000);

		}else{
			powerUpActive = false;
			reversedControls = false;
		}
	};

	Main.prototype.jumpHandler = function(){
		// Jump detected
		if (startScreen) {
			this.startGame();	
		}
		
		console.log('jump met bean');
	};

	Main.prototype.speedUpMeteoriteTimer = function(){
		meteoriteTimerValue -= 200;
		if (meteoriteTimerValue < 300) {
			meteoriteTimerValue = 300;
		}

		clearInterval(meteorTimer);
		if (spaceShip.warpSpeed) {
			meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue/10);
		}else{
			meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue);	
		}
	};

	Main.prototype.update = function() {

		if (timer.isRunning || preventGameFromStopping) {

			this.cleanMeteorites();
			this.cleanPowerUps();

			score.updateScore(1+gameSpeedFactor);

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
			// Check if reverse powerup is taken and reverse the controls
			var reverseFactor;
			if (reversedControls) {
				reverseFactor = -1;
			}else{
				reverseFactor = 1;
			}

			//	left
			if(keys[37] && debugKeyboardControl) {
				spaceShip.destinationPosition -= (2 * reverseFactor);	
			}

			//	Right
			if(keys[39]  && debugKeyboardControl) {
				spaceShip.destinationPosition += (2 * reverseFactor);
			}

			//	Space to shoot
			if (keys[32] || spaceShip.shootMode) {

				if (spaceShip.capableToFly && spaceShip.shootMode) {
					if (!bulletFired) {
						bulletFired = true;

						var bullet = new Bullet();
						bullet.init();
						bullet.directionAngle = spaceShip.ship.rotation;
						bullet.bullet.x = spaceShip.ship.x;
						bullet.bullet.y = spaceShip.ship.y- 25;

						bullets.push(bullet);

						stage.addChild(bullet.bullet);

						sound.playEffectWithVolume('Shoot', 100);
					}else{
						bulletCounter++;
						if (bulletCounter > 20) {
							bulletFired = false;
							bulletCounter = 0;
						}
					}
				}
				
			}else{
				bulletFired = false;
			}

			// Update all bullets
			if( bullets.length > 0){
				for (var j = 0; j < bullets.length; j++) {

					if (bullets[j].bullet.x < -30 || bullets[j].bullet.x > $('#cnvs').width()+30 || bullets[j].bullet.y < 0) {
						stage.removeChild(bullets[j].bullet);
						bullets[j] = null;	

						bullets.splice(j, 1);			
					}else{
						bullets[j].bullet.y -= 10;
						var radians = ((-90 +bullets[j].directionAngle) * Math.PI)/180;	
						bullets[j].bullet.x += (30 * Math.cos(radians));
					}
				}
			}

			// Update all meteorites
			if( meteorites.length > 0 ) {
				for (var i = 0; i < meteorites.length; i++) {
					meteorites[i].velY = 0.1;

					if ($('#cnvs').height() + 150 < meteorites[i].y) {
						meteorites[i] = null;					
						meteorites.splice(i, 1);						
						score.updateScore(50);	
					}else{
						meteorites[i].update();
					}

					if (!spaceShip.shipImmune && meteorites[i].meteorite) {
						if(CollisionDetection.checkCollisionCenterAnchor(spaceShip.ship, meteorites[i].meteorite) === 'hit'){
							// Ship crashed into a meteorite
							
							if (meteorites[i].canDoDamage) {
								console.log('[MAIN] stop score');
								sound.playEffectWithVolume('crashImpact', 100);
								score.enableScoreEdit = false;
								spaceShip.gotShot();
								meteorites[i].gotShot();
							}
						}
					}

					for (var l = 0; l < bullets.length; l++) {

						if(CollisionDetection.checkCollisionCenterAnchor(bullets[l].bullet, meteorites[i].meteorite) === 'hit'){
							// A bullet hit a meteorite
							if (meteorites[i].canDoDamage) {
								meteorites[i].gotShot();
								score.updateScore(100);
								sound.playEffectWithVolume('Explosion', 30);

								stage.removeChild(bullets[l].bullet);

								bullets[l] = null;
								bullets.splice(l, 1);						
								
								return false;
							}
						}
					}
				}
			}

			//update all powerups
			if (powerups.length > 0) {
				for (var m = 0; m < powerups.length; m++) {
					powerups[m].velY = 0.1;

					if (!powerUpActive) {

						if(CollisionDetection.checkCollisionCenterAnchor(spaceShip.ship, powerups[m].powerup) === 'hit'){
							// Ship crashed into a powerup
							//console.log('hit powerup');
							//console.log('[MAIN] powerup type = ' + powerups[m].type);

							sound.playEffectWithVolume('powerupCollected', 90);

							powerUpActive = true;
							powerups[m].collected = true;

							switch (powerups[m].type){
								case 'warp':
									this.togglePowerUpWarp(true);
								break;
								case 'shoot':
									this.togglePowerupShoot(true);
									//powerUpActive = false;
								break;
								case 'reverse':
									this.togglePowerUpReverse(true);
								break;
							}
						}
					}
					
					if (powerups[m].powerup.y > $('#cnvs').height() + 150) {

						stage.removeChild(powerups[m].powerup);
						powerups[m] = null;					
						powerups.splice(m, 1);

					}else{
						powerups[m].update();
					}
				}
			}
			
			
			if (spaceShip.capableToFly) {
				sound.changeRocketVolume(spaceShip.ship.rotation);	
			}else{
				sound.changeRocketVolume(0);	
			}

			spaceShip.update();
			powerupProgress.update();
			stage.update();
		}
	
	};

	Main.prototype.stopGame = function(){
		var date = new Date();
		date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		console.log('[MAIN] stop game ' + date);

		var self = this;
		timer.stop();

		self.toggleMeteoriteTimer(false);
		self.togglePowerupTimer(false);

		for (var j = 0; j < bullets.length; j++) {
			stage.removeChild(bullets[j].bullet);
			console.log('clear bullets');
			bullets[j] = null;
		}		

		for (var k = 0; k < meteorites.length; k++) {
			stage.removeChild(meteorites[k].meteorite);
			meteorites[k] = null;
		}

		for (var l = 0; l < powerups.length; l++) {
			stage.removeChild(powerups[l].powerup);
			powerups[l] = null;
		}

		gameSpeedFactor = 1;
		reversedControls = false;
		spaceShip.shootMode = false;
		powerUpActive = false;

		meteorites = [];
		bullets = [];
		powerups = [];

		var endScore = score.score;

		score.reset();
		spaceShip.reset();
		powerupProgress.reset();

		// Call EndScreen and clear object from screen
		//spaceShip.ship.alpha = 0;
		endScreen = new EndScreen(endScore);
		bean.on(endScreen, 'restartGame', this.restartGame);
		stage.addChild(endScreen.endContainer);

		stage.update();

		//ssetTimeout(this.startGame, 500);
	};

	Main.prototype.restartGame = function() {
		console.log('RESTART');
		stage.removeChild(endScreen.endContainer);
		bean.off(endScreen, 'restartGame', this.restartGame);
		endScreen.endContainer = null;
		console.log(meteorites.length);

		this.startGame();
	};

	Main.prototype.startGame = function(){

		if (startScreen) {
			stage.removeChild(startScreen.startContainer);
			startScreen = null;	
		}
		
		stage.addChild(spaceShip.ship);
		stage.addChild(powerupProgress.powerupProgress);

		var date = new Date();
		date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		console.log('[MAIN] start game ' + date);
		timer.start();
		spaceShip.ship.alpha = 1;
		this.toggleMeteoriteTimer(true);
		this.togglePowerupTimer(true);

		console.log(meteorites);
	};

	Main.prototype.toggleMeteoriteTimer = function(bool){
		if (!bool) {
			console.log('[MAIN] stop meteor timer');
			clearInterval(meteorTimer);
			meteoriteTimerValue = defaultMeteoriteTimerValue;
			meteorTimer = null;
		}else{
			console.log('[MAIN] start meteor timer');
			meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue);
			this.newMeteorite();
		}
	};

	Main.prototype.togglePowerupTimer = function(bool){
		if (!bool) {
			console.log('[MAIN] stop powerup timer');
			clearInterval(powerupTimer);
			powerupTimerValue = defaultPowerupTimerValue;
			powerupTimer = null;
		}else{
			console.log('[MAIN] start powerup timer');
			powerupTimer = setInterval(this.newPowerup, powerupTimerValue);
		}
	};

	Main.prototype.keyup = function(e) {
		keys[e.keyCode] = false;
	};

	Main.prototype.keydown = function(e) {
		keys[e.keyCode] = true;
	};

	Main.prototype.cleanPowerUps = function(){


		for (var i = 0; i < powerups.length; i++) {
			//console.log(powerups[i].readyToRemove);
			if(powerups[i].readyToRemove){
				stage.removeChild(powerups[i].powerup);
				powerups[i] = null;					
				powerups.splice(i, 1);
			}
		}
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

	Main.prototype.newPowerup = function(){
		if (!powerUpActive && powerups.length < 1) {
			// var date = new Date();
			// date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			// console.log('[MAIN] add powerup ' + date);
			var randomX = Math.random()*($('#cnvs').width());
			powerup = new Powerup(randomX, -100);
			powerup.init();
			stage.addChild(powerup.powerup);
			powerups.push(powerup);
		}
	};

	Main.prototype.newMeteorite = function() {
		// var date = new Date();
		// date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();		
		// console.log('[MAIN] add meteorite ' + date);
		if (Math.round(Math.random()*3) > 0 || 1 === 1) {
			var randomX = Math.random()*($('#cnvs').width());

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
	};

	Main.prototype.speedUpGame = function(){
		gameSpeedFactor += 0.1;
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

	Main.prototype.cancelConnection = function(){
		console.log('Disconnected from server');
		$('body').addClass('disconnected');
	};

	return Main;

})();
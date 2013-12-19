/* globals CanvasSetup:true, SpaceShip:true, Timer:true, Meteorite:true, Score:true, PowerupProgress:true, StartScreen:true, Powerup:true, SocketConnection:true, Bullet:true, CollisionDetection:true, Sound:true, EndScreen:true */

var Main = (function(){

	var stage, ticker, keys; 
	var spaceShip, timer, meteorite, powerupProgress, powerup, meteorites, bullet, sound, endScreen, startScreen;
	var meteorTimer;
	var powerupTimer;
	var socketConnection;
	var score;
	var collisionDetection;
	var lastMeteorXPos = -200;
	var enableNewMeteorites = true;
	var backgroundPos = 0;
	var bulletFired = false;
	var backgroundSpeed = 0.5;
	var gameSpeedFactor = 2;
	var powerUpActive = false;
	var defaultMeteoriteTimerValue = 1500; //new meteorite after x miliseconds
	var meteoriteTimerValue = defaultMeteoriteTimerValue;
	var defaultPowerupTimerValue = 3000; //new powerup after x miliseconds
	var powerupTimerValue = defaultPowerupTimerValue; 
	var debugKeyboardControl = false; //spel spelen met pijltjes
	var bulletCounter = 0; //aantal bullets fired
	var reversedControls = false;
	var preventGameFromStopping = false; //zorgt ervoor dat game niet stopt als je in warp mode zit
	var weightFactor = 3; // wordt automatisch geregeld
	var died = true;
	var powerupHistory = [];
	var nobodyIsPlaying = true;
	var getWeightTimer;
	var measuredWeights = [];
	var powerupEndTimeout;

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
		bean.on(timer, 'beep', this.beepHandler);

		$(document).on('click', '#mute', function(event) {
			event.preventDefault();
			sound.toggleMute();			
		});

		bean.on(socketConnection, 'horizontalPosition', function(data){		
			data = data + ((data - 50) * weightFactor );
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
				died = false;
				self.stopGame();	
			}
		});

		bean.on(timer, 'secondPast', this.speedUpGame);

		bean.on(socketConnection, 'weightReceived', function(data){
			measuredWeights.push(data);
			if (measuredWeights.length > 3) {
				measuredWeights.shift();
			}
		});

		bean.on(timer, 'speedUpMeteorites', this.speedUpMeteoriteTimer);

		// StageTicker
		ticker = createjs.Ticker;
		ticker.setFPS(60);
		ticker.addEventListener('tick', this.update);
		
		this.showStartScreen();

		getWeightTimer = setInterval(function(){
			if(nobodyIsPlaying){
				socketConnection.askForWeight();	
			}			
		}, 500); 

		socketConnection.setBoardColor('white');
		
		//endScreen = new EndScreen(300);
		//stage.addChild(endScreen.endContainer);

		//sound.toggleMute();
	};

	Main.prototype.togglePowerUpWarp = function(enablePowerUp){
		var self = this;

		if (enablePowerUp) {
			// Play soundeffect
			score.updateScore(250);

			

			console.log(timer.timer);

			if (timer.timer < 4) {
				died = false;
				preventGameFromStopping = true;	
			}
			
			sound.playEffectWithVolume('WarpSpeed', 100);
			socketConnection.setBoardColor('blue');

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

			powerupEndTimeout = setTimeout(function(){
				self.togglePowerUpWarp(false);
			}, 3000);

		}else{
			// clear timer and restart at normal speed
			
			clearInterval(meteorTimer);
			meteorTimer = setInterval(this.newMeteorite, meteoriteTimerValue);
			spaceShip.warpSpeed = false;

			setTimeout(function(){
				if (timer.isRunning) {
					socketConnection.setBoardColor('white');
				}
				powerUpActive = false;
				spaceShip.shipImmune = false;
			}, 1300);

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
			bulletCounter = 0;
			score.updateScore(250);

			powerupProgress.beginShootProgress(4700);
			socketConnection.setBoardColor('green');

			powerupEndTimeout = setTimeout(function(){
				self.togglePowerupShoot(false);
			}, 5000);

		}else{
			powerUpActive = false;
			spaceShip.shootMode = false;
			if (timer.isRunning) {
				socketConnection.setBoardColor('white');
			}
		}
	};

	Main.prototype.togglePowerupSmaller = function(enablePowerUp){
		if (enablePowerUp) {
			spaceShip.smallerMode = true;

			var self = this;
			score.updateScore(250);

			powerupProgress.beginSmallerProgress(4700);
			socketConnection.setBoardColor('yellow');

			sound.playEffectWithVolume('SmallerFast', 70);

			powerupEndTimeout = setTimeout(function(){
				self.togglePowerupSmaller(false);
			}, 5000);

		}else{
			powerUpActive = false;
			spaceShip.smallerMode = false;
			socketConnection.setBoardColor('white');

			if (timer.isRunning) {
				sound.playEffectWithVolume('BiggerFast', 70);
			}
		}
	};

	Main.prototype.togglePowerupBigger = function(enablePowerUp){
		if (enablePowerUp) {
			spaceShip.biggerMode = true;

			var self = this;
			score.updateScore(250);

			powerupProgress.beginBiggerProgress(4700);
			socketConnection.setBoardColor('purple');

			sound.playEffectWithVolume('BiggerFast', 70);

			powerupEndTimeout = setTimeout(function(){
				self.togglePowerupBigger(false);
			}, 5000);

		}else{

			if (timer.isRunning) {
				socketConnection.setBoardColor('white');
				sound.playEffectWithVolume('SmallerFast', 70);
			}

			powerUpActive = false;
			spaceShip.biggerMode = false;
			
		}
	};

	Main.prototype.togglePowerUpReverse = function(enablePowerUp) {
		if (enablePowerUp) {
			var self = this;
			score.updateScore(250);

			reversedControls = true;
			powerupProgress.beginReverseProgress(4000);

			socketConnection.setBoardColor('red');

			sound.playEffectWithVolume('reverse', 35);

			powerupEndTimeout = setTimeout(function(){
				self.togglePowerUpReverse(false);
			}, 4000);

		}else{
			powerUpActive = false;
			reversedControls = false;

			if (timer.isRunning) {
				socketConnection.setBoardColor('white');
			}
		}
	};

	Main.prototype.jumpHandler = function(){
		// Jump detected
		if (startScreen || endScreen) {
			this.calculateWeightFactor();
			this.startGame();	
		}
	};

	Main.prototype.calculateWeightFactor = function(){

		//from sample points = (75, 0.1)(30, 3)
		//we get this function y = -0.0644x	+4.93333

		if (measuredWeights[1]) {
			console.log('measured weight= ' + measuredWeights);
			var averageMeasuredWeight = 0;

			for (var i = 0; i < measuredWeights.length; i++) {
				averageMeasuredWeight = Math.max(averageMeasuredWeight, measuredWeights[1]);
			}

			console.log(averageMeasuredWeight);
			//averageMeasuredWeight = Math.round(averageMeasuredWeight/measuredWeights.length);

			weightFactor = (-0.0644*measuredWeights[1]) + 4.933;
			weightFactor = Math.round(weightFactor*1000)/1000;
			weightFactor = Math.max(0.05, weightFactor);
			console.log(weightFactor);

		}else{
			weightFactor = 1;
		}
	};

	Main.prototype.speedUpMeteoriteTimer = function(){

		// lower value = slower meteorite spawn
		meteoriteTimerValue -= 150;
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

		//fps
		var currentFPS = Math.round(ticker.getMeasuredFPS()*10)/10;
		$('#fps').hide();
		//$('#fps').html(currentFPS);

		if (currentFPS < 30) {
			$('#fps').addClass('veryLow');			
		}else if(currentFPS < 40){
			$('#fps').addClass('midLow');
		}else if(currentFPS < 50){	
			$('#fps').addClass('low');
		}else{
			$('#fps').removeClass('veryLow').removeClass('low').removeClass('midLow');
		}
		
		//	Space to shoot
		if(keys[32]){
			if (debugKeyboardControl && (startScreen || endScreen)) {
				this.startGame();
			}
		}	

		if (keys[82]) {

			if ((endScreen || startScreen) && !timer.isRunning) {
				console.log('restart game');
				this.startGame();
			}
		}

		if (timer.isRunning || preventGameFromStopping) {

			nobodyIsPlaying = false;

			this.cleanMeteorites();
			this.cleanPowerUps();

			score.updateScore(1+gameSpeedFactor);

			//set background speed
			if (!spaceShip.warpSpeed) {
				backgroundSpeed += (0.5 - backgroundSpeed) * 0.05;
			}else{
				backgroundSpeed += (5 - backgroundSpeed) * 0.05;
			}

			// backgroundPos += (backgroundSpeed*gameSpeedFactor);
			// backgroundPos = Math.round(backgroundPos*10)/10;

			//console.log(backgroundPos);

			// $('body').css('background-position-y', (backgroundPos/2)+'px');
			// $('#container').css('background-position-y', (backgroundPos)+'px');

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
			
			if (spaceShip.shootMode) {

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
							
							if (meteorites[i].canDoDamage && spaceShip.capableToFly) {
								socketConnection.setBoardColor('dead');
								console.log('[MAIN] stop score');
								sound.playEffectWithVolume('crashImpact', 100);
								sound.playEffectWithVolume('dead', 90);
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
								meteorites[i].gotShot(true);
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

					if (!powerUpActive && spaceShip.capableToFly) {

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
								break;
								case 'reverse':
									this.togglePowerUpReverse(true);
								break;
								case 'bigger':
									this.togglePowerupBigger(true);
								break;
								case 'smaller':
									this.togglePowerupSmaller(true);
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
				sound.changeRocketVolume(spaceShip.ship.rotation *2);	
			}else{
				sound.changeRocketVolume(0);	
			}

			spaceShip.update();
			powerupProgress.update();
			
		}else{
			nobodyIsPlaying = true;
		}

		backgroundPos += (backgroundSpeed*gameSpeedFactor);
			backgroundPos = Math.round(backgroundPos*10)/10;
		$('body').css('background-position-y', (backgroundPos/2)+'px');
		$('#container').css('background-position-y', (backgroundPos)+'px');

		stage.update();
	};

	Main.prototype.stopGame = function(){
		var date = new Date();
		date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		console.log('[MAIN] stop game ' + date);

		clearTimeout(powerupEndTimeout);

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
		sound.changeRocketVolume(0);
		powerupProgress.reset();

		// Call EndScreen and clear object from screen
		//spaceShip.ship.alpha = 0;
		$('#score').hide();

		if (!died) {
			socketConnection.setBoardColor('party');
			sound.playEffectWithVolume('win', 40);
		}else{
			socketConnection.setBoardColor('dead');
		}

		endScreen = new EndScreen(endScore, died);
		bean.on(endScreen, 'startGame', this.startGame);
		bean.on(endScreen, 'showStartScreen', this.showStartScreen);
		
		stage.addChild(endScreen.endContainer);

		died = true;
	};

	Main.prototype.startGame = function(){

		$('#score').show();

		bean.off(startScreen, 'startGame', this.startGame);
		bean.off(endScreen, 'startGame', this.startGame);
		bean.off(endScreen, 'showStartScreen', this.showStartScreen);

		if (startScreen) {
			stage.removeChild(startScreen.startContainer);
			startScreen.startContainer = null;
			startScreen = null;
		}

		if (endScreen) {
			stage.removeChild(endScreen.endContainer);
			endScreen.endContainer = null;
			endScreen = null;
		}
		
		stage.addChild(spaceShip.ship);
		stage.addChild(powerupProgress.powerupProgress);

		var date = new Date();
		date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		console.log('[MAIN] start game ' + date);
		timer.start();
		spaceShip.ship.alpha = 1;
		this.toggleMeteoriteTimer(true);

		socketConnection.setBoardColor('white');

		var self = this;
		setTimeout(function() {
			self.togglePowerupTimer(true);
		}, 5000);

		sound.playEffectWithVolume('start', 40);

		console.log(meteorites);
	};

	Main.prototype.showStartScreen = function(){

		$('#score').hide();

		bean.off(endScreen, 'showStartScreen', this.showStartScreen);

		if (endScreen) {
			stage.removeChild(endScreen.endContainer);
			endScreen.endContainer = null;
			endScreen = null;
		}

		startScreen = new StartScreen();
		stage.addChild(startScreen.startContainer);

		socketConnection.setBoardColor('white');

		bean.on(startScreen, 'startGame', this.startGame);
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
			//var randomX = Math.random()*($('#cnvs').width());
			var randomX = 30 + Math.round(Math.random()*($('#cnvs').width()-60));
			powerup = new Powerup(randomX, -100);

			var uniquePowerup = false;
			var randomPowerupIndex = 0;

			while(!uniquePowerup){
				uniquePowerup = true;
				randomPowerupIndex = Math.floor(Math.random()*powerup.types.length);
				
				for (var i = 0; i < powerupHistory.length; i++) {
					if (powerupHistory[i] === randomPowerupIndex) {
						uniquePowerup = false;
					}
				}
			}

			powerupHistory.push(randomPowerupIndex);

			var numberOfUniquePowerupSequence = 3;
			if (powerupHistory.length > numberOfUniquePowerupSequence) {
				powerupHistory.shift();
			}

			powerup.init(randomPowerupIndex);
			stage.addChild(powerup.powerup);
			powerups.push(powerup);
		}
	};

	Main.prototype.newMeteorite = function() {
		
		var randomX = 30 + Math.round(Math.random()*($('#cnvs').width()-60));

		if( Math.abs(randomX - lastMeteorXPos) > 100 ) {
			lastMeteorXPos = randomX;
			meteorite = new Meteorite(randomX, -100);
			meteorite.speedFactor = gameSpeedFactor;
			meteorite.init();

			if (spaceShip.warpSpeed) {
				meteorite.enableWarpSpeed = true;
			}else{
				meteorite.enableWarpSpeed = false;
				//spaceShip.shipImmune = false;
			}

			meteorites.push(meteorite);
			stage.addChild(meteorite.meteorite);
		}else {
			this.newMeteorite();
		}
		
	};

	Main.prototype.speedUpGame = function(){
		gameSpeedFactor += 0.05;
	};

	Main.prototype.beepHandler = function(beep){

		if (beep ==='double') {
			sound.playEffectWithVolume('doubleBeep2', 70);
		}else if(beep ==='single'){
			sound.playEffectWithVolume('beep2', 60);
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

	Main.prototype.cancelConnection = function(){
		console.log('Disconnected from server');
		$('body').addClass('disconnected');
	};

	return Main;

})();
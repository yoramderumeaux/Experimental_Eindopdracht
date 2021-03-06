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
		this.bullet.graphics.beginStroke('#aef69d');
		this.bullet.graphics.setStrokeStyle(3);
		this.bullet.graphics.beginFill('rgba(0, 92,112,0.2)');
		this.bullet.graphics.drawCircle(0,0,2);
		this.bullet.graphics.endStroke();
		this.bullet.shadow = new createjs.Shadow('#1bf43f', 0, 0, 10);
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
		canvasWidth = Math.round(canvasWidth*100)/100;
		this.$canvasElement.css('width', canvasWidth);
	};


	return CanvasSetup;

})();

var CollisionDetection = (function(){

	function CollisionDetection() {

	}

	CollisionDetection.checkCollisionCenterAnchor = function(shapeA, shapeB) {

		var vX = shapeA.x - shapeB.x;
		var vY = shapeA.y - shapeB.y;
		var distance = Math.sqrt(Math.pow(vX, 2) + Math.pow(vY,2));

		var shapeAWidth = Math.min(shapeA.width/2, shapeA.height/2);
		var shapeBWidth = Math.min(shapeB.width/2, shapeB.height/2);

		// var hWidths = (shapeA.width/2) + (shapeB.width/2);	
		// var hHeight = (shapeA.height/2) + (shapeB.height/2);

		// Collision
		// if(Math.abs(vX) < hWidths && Math.abs(vY) < hHeight) {
		// return 'hit';	
		// }

		if (distance < (shapeAWidth+shapeBWidth)) {
			return 'hit';
		}

		return 'noHit';

	};
	
	return CollisionDetection;

})();

/* globals SpaceShip:true */

var EndScreen = (function(){

	var canvasWidth = 0;
	var canvasHeight = 0;


	function EndScreen(endScore, died) {
		_.bindAll(this);
		
		this.endScore = endScore;
		this.died = died;
		this.init();

		//$(document).on('click', this.restartGame);

		this.waiting = setInterval(this.showStartscreen, 10000);
	}

	EndScreen.prototype.init = function() {

		canvasWidth = $('#cnvs').width() +5;
		canvasHeight = $('#cnvs').height()+5;

		this.endContainer = new createjs.Container();

		this.backgroundImage = new createjs.Bitmap('images/blueBG.png');
		this.backgroundImage.alpha = 0.25;

		this.text = new createjs.Text('space evader', '48px CFSpaceship', '#FFFFFF');
		this.text.x = (canvasWidth - this.text.getBounds().width)/2;
		this.text.y = 70;

		this.line = new createjs.Shape();
		this.line.graphics.beginStroke('#ffffff');
		this.line.graphics.setStrokeStyle(2);
		this.line.graphics.moveTo(0,0);
		this.line.graphics.lineTo(canvasWidth-60, 0);
		this.line.x = 30;
		this.line.y = 130;
		this.line.shadow = new createjs.Shadow('#00ADEE', 0, 0, 10);

		var spaceShip = null;
		var endIcon = new createjs.Container();
		var decorLines = new createjs.Shape();

		if(this.died) {
			this.congratsText = new createjs.Text('Jammer, je haalde het net niet!', '30px ralewayLight', '#E75F5F');
			// this.congratsText.x = (canvasWidth - this.congratsText.getBounds().width)/2;
			// this.congratsText.y = ((canvasHeight - this.congratsText.getBounds().height)/2) - 190;

			spaceShip = new SpaceShip(0,0, true, true);
			spaceShip.ship.rotation = -111;
			spaceShip.ship.scaleX = spaceShip.ship.scaleY = 1.5;

			endIcon.x = canvasWidth/2;
			endIcon.y = this.congratsText.y + 120;
		}else {
			this.congratsText = new createjs.Text('Proficiat! Je haalde het einde!', '30px ralewayLight', '#63DF76');
			

			spaceShip = new SpaceShip(0,0, true, false);
			spaceShip.ship.scaleX = spaceShip.ship.scaleY = 1.5;
		}

		this.congratsText.x = (canvasWidth - this.congratsText.getBounds().width)/2;
		this.congratsText.y = ((canvasHeight - this.congratsText.getBounds().height)/2) - 190;

		endIcon.x = canvasWidth/2;
		endIcon.y = this.congratsText.y + 120;
		endIcon.addChild(spaceShip.ship);

		this.text2 = new createjs.Text('Je behaalde een score van', '25px ralewayLight', '#FFFFFF');
		this.text2.x = (canvasWidth - this.text2.getBounds().width)/2;
		this.text2.y = ((canvasHeight - this.text2.getBounds().height)/2) + 30;

		this.scoreText = new createjs.Text(this.endScore, '65px menschWeb', '#FFFFFF');
		this.scoreText.x = (canvasWidth - this.scoreText.getBounds().width)/2;
		this.scoreText.y = ((canvasHeight - this.scoreText.getBounds().height)/2) + 100;

		this.jumpText = new createjs.Text('Spring om opnieuw te proberen', '25px ralewayLight', '#FFFFFF');		
		this.jumpText.y = canvasHeight - 80;
		this.jumpText.x = (canvasWidth - this.jumpText.getBounds().width)/2;

		var jumpOffset = 20;
		this.jump = new createjs.Shape();
		this.jump.x = 0;
		this.jump.y = 0;
		this.jump.graphics.beginStroke('#00d2ff');
		this.jump.graphics.setStrokeStyle(3);
		this.jump.graphics.moveTo(0,97);
		this.jump.graphics.lineTo(6,104);
		this.jump.graphics.lineTo(48.5,100);

		this.jump.graphics.lineTo(91,104);
		this.jump.graphics.lineTo(97,97);

		this.jump.graphics.lineTo(77,84);
		this.jump.graphics.lineTo(48.5,78);
		this.jump.graphics.lineTo(20,84);
		this.jump.graphics.lineTo(0,97);
		
		this.jump.graphics.endStroke();
		this.jump.graphics.beginStroke('#ffffff');
		this.jump.graphics.moveTo(29,94-jumpOffset);
		this.jump.graphics.lineTo(37,77-jumpOffset);
		this.jump.graphics.lineTo(50,63-jumpOffset);
		this.jump.graphics.lineTo(62,77-jumpOffset);
		this.jump.graphics.lineTo(69,94-jumpOffset);
		this.jump.graphics.moveTo(50,63-jumpOffset);
		this.jump.graphics.lineTo(50,29-jumpOffset);
		//this.jump.graphics.lineTo(37,23);
		this.jump.graphics.moveTo(27,32-jumpOffset);
		this.jump.graphics.lineTo(36,41-jumpOffset);
		this.jump.graphics.lineTo(50,41-jumpOffset);
		this.jump.graphics.lineTo(64,41-jumpOffset);
		this.jump.graphics.lineTo(73,32-jumpOffset);

		this.jump.graphics.endStroke();
		this.jump.graphics.beginStroke('#fff448');

		this.jump.graphics.moveTo(37,77+25-jumpOffset);
		this.jump.graphics.lineTo(50,63+25-jumpOffset);
		this.jump.graphics.lineTo(62,77+25-jumpOffset);

		this.jump.graphics.moveTo(37,77+35-jumpOffset);
		this.jump.graphics.lineTo(50,63+35-jumpOffset);
		this.jump.graphics.lineTo(62,77+35-jumpOffset);

		// this.jump.graphics.lineTo(56,25);
		// this.jump.graphics.lineTo(56,11);
		this.jump.graphics.endFill();
		this.jump.graphics.beginStroke('#ffffff');
		this.jump.graphics.drawCircle(50, 17-jumpOffset, 12);
		this.jump.graphics.endFill();
		this.jump.x = (canvasWidth / 2)-(35*this.jump.scaleX);
		this.jump.y = this.jumpText.y - 80;
		this.jump.shadow = new createjs.Shadow('#00ADEE', 0, 0, 10);
		this.jump.scaleX = this.jump.scaleY = 0.7;

		this.endContainer.addChild(this.backgroundImage);
		this.endContainer.addChild(this.text);
		this.endContainer.addChild(this.text2);
		this.endContainer.addChild(this.congratsText);
		this.endContainer.addChild(this.line);
		this.endContainer.addChild(this.jumpText);
		this.endContainer.addChild(this.jump);
		this.endContainer.addChild(this.scoreText);	

		if (spaceShip) {
			this.endContainer.addChild(endIcon);
		}
	};

	EndScreen.prototype.showStartscreen = function(){
		clearInterval(this.waiting);
		bean.fire(this, 'showStartScreen');
	};

	EndScreen.prototype.restartGame = function(e) {
		var self = this;
		$(document).off('click', this.restartGame);
		bean.fire(this, 'startGame');
	};

	return EndScreen;

})();

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
	var prevScreenHeight = 0;

	function Main($sourceElement) {

		_.bindAll(this);
		this.$sourceElement = $sourceElement;

		keys = [];
		meteorites = [];

		prevScreenHeight = $(window).height();

		$( window ).resize(function() {
			if (screen.height <= $(window).height() && prevScreenHeight !== screen.height) {
				location.reload();
			}else if(prevScreenHeight > $(window).height()){
				location.reload();
			}

			console.log(prevScreenHeight);
			prevScreenHeight = $(window).height();
		});
	}

	Main.prototype.init = function() {
		// Setup canvas and Stageobject
		this.setupStage();

		socketConnection = new SocketConnection();
		socketConnection.init();

		//wait for response of server
		bean.on(socketConnection, 'connectionOk', this.connectionOk);
		bean.on(socketConnection, 'cancelConnection', this.cancelConnection);

		var self = this;		
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
		this.velY = 0.1;
		this.speed = 10;
		this.speedFactor = 1;
		this.enableWarpSpeed = false;
		this.warpSpeedTarget = 30;
		this.currentWarpSpeed = 0;
		this.rotationDirection = -1 + 2*(Math.random());
		this.removeMe = false;
		this.canDoDamage = true;
		this.readyToRemove = false;
		this.forPoints = false;
		//this.gravity = 3.8;
	}

	Meteorite.prototype.init = function() {
		this.speed = (10+ Math.round(Math.random()*10)) * this.speedFactor;

		this.meteorite = new createjs.Container();
		this.meteoriteLines = new createjs.Shape();
		this.meteorite.x = this.x;
		this.meteorite.y = this.y;

		this.drawMeteorite();
	};

	Meteorite.prototype.gotShot = function(forPoints){
		this.removeMe = true;
		this.canDoDamage = false;

		if (forPoints) {
			this.forPoints = true;
		}
	};

	Meteorite.prototype.drawMeteorite = function() {

		this.meteoriteLines.graphics.beginStroke('#fcf5bf');
		this.meteoriteLines.graphics.setStrokeStyle(3);
		if(enableFill) {this.meteoriteLines.graphics.beginFill('rgba(206, 75,29,0.1)');}

		

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
				this.meteoriteLines.graphics.moveTo(randomMeteorite[j][0] - horizontalOffset, randomMeteorite[j][1] - verticalOffset);	
			}else{
				this.meteoriteLines.graphics.lineTo(randomMeteorite[j][0] - horizontalOffset, randomMeteorite[j][1] - verticalOffset);	
			}
		}
		
		if(enableFill) {this.meteoriteLines.graphics.endFill();}

		this.meteoriteLines.graphics.endStroke();

		// debug circles
		// this.meteorite.graphics.beginFill('rgba(255,0,0,0.5)');
		// this.meteorite.graphics.drawCircle(0,0, 27.5);
		// this.meteorite.graphics.endFill();

		this.meteoriteLines.shadow = new createjs.Shadow('#ce4b1d', 0, 0, 5);
		this.meteorite.addChild(this.meteoriteLines);

		this.text = new createjs.Text('+100', '20px ralewayLight', '#fcf5bf');
		this.text.alpha = 0;
		this.text.regX = this.text.getBounds().width / 2;
		this.text.regY = this.text.getBounds().height / 2;
		this.meteorite.addChild(this.text);
	};

	Meteorite.prototype.update = function() {

		if (this.currentWarpSpeed < (this.warpSpeedTarget*this.enableWarpSpeed)) {
			this.currentWarpSpeed += 0.01;
		}else{
				this.currentWarpSpeed = 0;
		}
		
		this.y += this.velY * (this.speed * (1 + this.currentWarpSpeed *30));
		this.meteorite.y = this.y;
		this.meteorite.rotation += (this.rotationDirection * (this.speed)/40);
		this.text.rotation = -this.meteorite.rotation;
		//this.meteorite.rotation += 30;
		this.velY *= this.gravity;

		if (this.removeMe) {
			if (this.forPoints) {
				this.text.alpha = 1;
				this.text.x += 1;
				this.text.scaleX = this.text.scaleY += (10 - this.text.scaleX) * 0.1;
			}
			this.meteorite.scaleX = this.meteorite.scaleY += (0 - this.meteorite.scaleX) * 0.1;

			if (this.meteorite.scaleX < 0.05) {
				this.readyToRemove = true;
			}
		}



		//this.meteorite.y = this.y = 200;
	};


	return Meteorite;

})();

var Powerup = (function(){

	var x;
	var y;
	var primaryColor = ['#aef69d', '#00d2ff', '#e75f5f', '#fff448', '#AE81FF'];
	var shadowColor = ['#1bf43f', '#005c70', '#db2020', '#fff665', '#8542ff'];

	function Powerup(x, y) {
		_.bindAll(this);
		this.x = x;
		this.y = y;
		this.velY = 0;
		this.speed = 30;
		this.speedFactor = 1;
		this.types = ['shoot', 'warp', 'reverse', 'smaller', 'bigger'];
		this.enableWarpSpeed = false;
		this.warpSpeedTarget = 30;
		this.currentWarpSpeed = 0;
		this.rotationDirection = -1 + 2*(Math.random());
		this.removeMe = false;
		this.readyToRemove = false;
		this.collected = false;
		this.randomNumber = 0;
	}

	Powerup.prototype.init = function(type) {	
		this.speed = (30+ Math.round(Math.random()*30)) * this.speedFactor;
		if ($.isNumeric(type)) {
			//this.randomNumber = Math.floor(Math.random()*types.length);
			this.randomNumber = type;
		}else{
			switch(type){
				case 'warp':
				this.randomNumber = 1;
				break;
				case 'shoot':
				this.randomNumber = 0;
				break;
				case 'reverse':
				this.randomNumber = 2;
				break;
				case 'smaller':
				this.randomNumber = 3;
				break;
				case 'bigger':
				this.randomNumber = 4;
				break;
			}
		}
		
		this.type = this.types[this.randomNumber];
		this.drawPowerup();
	};

	Powerup.prototype.drawPowerup = function(){

		this.powerup = new createjs.Container();

		this.powerup.x = this.x;
		this.powerup.y = this.y;
		this.powerup.width = 50;
		this.powerup.height = 50;

		var squareSize = 40;
		var square = new createjs.Shape();

		square.graphics.beginStroke(primaryColor[this.randomNumber]);
		this.powerup.shadow = new createjs.Shadow(shadowColor[this.randomNumber], 0, 0, 10);
		square.graphics.beginFill('rgba(0, 92,112,0.2)');
		
		square.graphics.setStrokeStyle(3);
		square.graphics.drawRect(-(squareSize/2),-(squareSize/2),squareSize,squareSize);
		square.rotation = 45;

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
			
		}else if(this.type === 'shoot') {
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

		}else if(this.type === 'reverse') {
			var arrowLines = new createjs.Shape();
			arrowLines.graphics.beginStroke(primaryColor[this.randomNumber]);
			arrowLines.graphics.setStrokeStyle(3);
			arrowLines.graphics.moveTo(10, -5);
			arrowLines.graphics.lineTo(-10, -5);
			arrowLines.graphics.lineTo(-6, -9);
			arrowLines.graphics.moveTo(-10, -5);
			arrowLines.graphics.lineTo(-6, -1);

			arrowLines.graphics.moveTo(-10, 5);
			arrowLines.graphics.lineTo(10, 5);
			arrowLines.graphics.lineTo(6, 1);
			arrowLines.graphics.moveTo(10,5);
			arrowLines.graphics.lineTo(6, 9);

			this.powerup.addChild(arrowLines);

		}else if(this.type === 'smaller') {
			var resizer = new createjs.Shape();
			resizer.graphics.beginStroke(primaryColor[this.randomNumber]);
			resizer.graphics.setStrokeStyle(3);
			resizer.graphics.drawRect(-10, -10, 20, 20);
			resizer.graphics.setStrokeStyle(1);
			resizer.graphics.drawRect(-2, -2, 4, 4);

			this.powerup.addChild(resizer);

		}else if(this.type === 'bigger') {
			var resizerBig = new createjs.Shape();
			resizerBig.graphics.beginStroke(primaryColor[this.randomNumber]);

			resizerBig.graphics.setStrokeStyle(1);
			resizerBig.graphics.drawRect(-10, -10, 20, 20);
			resizerBig.graphics.setStrokeStyle(7);
			resizerBig.graphics.drawRect(-2, -2, 4, 4);

			this.powerup.addChild(resizerBig);
		}		


	};

	Powerup.prototype.update = function() {

		if (!this.collected) {
			/*if (this.currentWarpSpeed < (this.warpSpeedTarget*this.enableWarpSpeed)) {
				this.currentWarpSpeed += 0.01;
			}else{
				this.currentWarpSpeed = 0;
			}
			*/
			this.y += this.velY * (this.speed * (1 + this.currentWarpSpeed *30));
			this.powerup.y = this.y;
			var lol = 1;
		}else{
			this.powerup.scaleX = this.powerup.scaleY += 0.1;
			this.powerup.alpha -= 0.1;

			if (this.powerup.alpha <= 0) {
				this.readyToRemove = true;
			}
		}
		
	};

	return Powerup;

})();

var PowerupProgress = (function(){

	var canvasWidth = 0;
	var canvasHeight = 0;
	var milisec = 40;

	function PowerupProgress() {
		this.x = 0;
		this.y = 0;
		this.timer = null;
		this.timerValue = 0;
		this.currentTimerValue = 0;

		canvasWidth = $('#cnvs').width() +5;
		canvasHeight = $('#cnvs').height()+5;

		this.powerupProgress = new createjs.Container();
		this.powerupProgress.y = canvasHeight;
		this.powerupProgress.x = 0;

		this.hideProgressBar = true;

		this.drawSliders();
	}

	PowerupProgress.prototype.drawSliders = function(){

		var progressBarHeight = 50;
		this.greenprogressSlider = new createjs.Shape();
		this.greenprogressSlider.y = 0;
		this.greenprogressSlider.x = - canvasWidth;
		this.greenprogressSlider.graphics.beginFill('#aef69d');
		this.greenprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.blueprogressSlider = new createjs.Shape();
		this.blueprogressSlider.y = 0;
		this.blueprogressSlider.x = - canvasWidth;
		this.blueprogressSlider.graphics.beginFill('#00d2ff');
		this.blueprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.redprogressSlider = new createjs.Shape();
		this.redprogressSlider.y = 0;
		this.redprogressSlider.x = - canvasWidth;
		this.redprogressSlider.graphics.beginFill('#e75f5f');
		this.redprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.yellowprogressSlider = new createjs.Shape();
		this.yellowprogressSlider.y = 0;
		this.yellowprogressSlider.x = - canvasWidth;
		this.yellowprogressSlider.graphics.beginFill('#fff448');
		this.yellowprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.purpleprogressSlider = new createjs.Shape();
		this.purpleprogressSlider.y = 0;
		this.purpleprogressSlider.x = - canvasWidth;
		this.purpleprogressSlider.graphics.beginFill('#AE81FF');
		this.purpleprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.redprogressSlider = new createjs.Shape();
		this.redprogressSlider.y = 0;
		this.redprogressSlider.x = - canvasWidth;
		this.redprogressSlider.graphics.beginFill('#e75f5f');
		this.redprogressSlider.graphics.drawRect(0,0,canvasWidth,progressBarHeight);

		this.greenprogressbar = new createjs.Shape();
		this.greenprogressbar.x = this.x;
		this.greenprogressbar.y = 0;
		this.greenprogressbar.graphics.beginFill('rgba(0, 92, 112, 0.2)');
		this.greenprogressbar.graphics.beginStroke('#aef69d');
		this.greenprogressbar.graphics.drawRect(0,0,canvasWidth,progressBarHeight);
		this.greenprogressbar.shadow = new createjs.Shadow('#1bf43f', 0, 0, 10);
		
		this.blueprogressbar = new createjs.Shape();
		this.blueprogressbar.x = this.x;
		this.blueprogressbar.y = 0;
		this.blueprogressbar.graphics.beginFill('rgba(0, 92, 112, 0.2)');
		this.blueprogressbar.graphics.beginStroke('#00d2ff');
		this.blueprogressbar.graphics.drawRect(0,0,canvasWidth,progressBarHeight);
		this.blueprogressbar.shadow = new createjs.Shadow('#005c70', 0, 0, 10);	

		//kleuren nog aanpassen
		this.yellowprogressbar = new createjs.Shape();
		this.yellowprogressbar.x = this.x;
		this.yellowprogressbar.y = 0;
		this.yellowprogressbar.graphics.beginFill('rgba(0, 92, 112, 0.2)');
		this.yellowprogressbar.graphics.beginStroke('#fff448');
		this.yellowprogressbar.graphics.drawRect(0,0,canvasWidth,progressBarHeight);
		this.yellowprogressbar.shadow = new createjs.Shadow('#fff665', 0, 0, 10);

		//kleuren nog aanpassnen
		this.purpleprogressbar = new createjs.Shape();
		this.purpleprogressbar.x = this.x;
		this.purpleprogressbar.y = 0;
		this.purpleprogressbar.graphics.beginFill('rgba(0, 92, 112, 0.2)');
		this.purpleprogressbar.graphics.beginStroke('#AE81FF');
		this.purpleprogressbar.graphics.drawRect(0,0,canvasWidth,progressBarHeight);
		this.purpleprogressbar.shadow = new createjs.Shadow('#8542ff', 0, 0, 10);	

		this.redprogressbar = new createjs.Shape();
		this.redprogressbar.x = this.x;
		this.redprogressbar.y = 0;
		this.redprogressbar.graphics.beginFill('rgba(0, 92, 112, 0.2)');
		this.redprogressbar.graphics.beginStroke('#e75f5f');
		this.redprogressbar.graphics.drawRect(0,0,canvasWidth,progressBarHeight);
		this.redprogressbar.shadow = new createjs.Shadow('#db2020', 0, 0, 10);

		this.powerupProgress.addChild(this.greenprogressSlider);
		this.powerupProgress.addChild(this.blueprogressSlider);
		this.powerupProgress.addChild(this.redprogressSlider);
		this.powerupProgress.addChild(this.yellowprogressSlider);
		this.powerupProgress.addChild(this.purpleprogressSlider);
		this.powerupProgress.addChild(this.greenprogressbar);
		this.powerupProgress.addChild(this.blueprogressbar);
		this.powerupProgress.addChild(this.yellowprogressbar);
		this.powerupProgress.addChild(this.purpleprogressbar);
		this.powerupProgress.addChild(this.redprogressbar);
	};

	PowerupProgress.prototype.beginShootProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 1;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 0;
		this.redprogressbar.alpha = this.redprogressSlider.alpha = 0;
		this.yellowprogressbar.alpha = this.yellowprogressSlider.alpha = 0;
		this.purpleprogressbar.alpha = this.purpleprogressSlider.alpha = 0;
		this.startTimer(time);
	};

	PowerupProgress.prototype.beginWarpProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 0;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 1;
		this.redprogressbar.alpha = this.redprogressSlider.alpha = 0;
		this.yellowprogressbar.alpha = this.yellowprogressSlider.alpha = 0;
		this.purpleprogressbar.alpha = this.purpleprogressSlider.alpha = 0;
		this.startTimer(time);
	};

	PowerupProgress.prototype.beginReverseProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 0;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 0;
		this.redprogressbar.alpha = this.redprogressSlider.alpha = 1;
		this.yellowprogressbar.alpha = this.yellowprogressSlider.alpha = 0;
		this.purpleprogressbar.alpha = this.purpleprogressSlider.alpha = 0;
		this.startTimer(time);
	};

	PowerupProgress.prototype.beginSmallerProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 0;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 0;
		this.redprogressbar.alpha = this.redprogressSlider.alpha = 0;
		this.yellowprogressbar.alpha = this.yellowprogressSlider.alpha = 1;
		this.purpleprogressbar.alpha = this.purpleprogressSlider.alpha = 0;
		this.startTimer(time);
	};

	PowerupProgress.prototype.beginBiggerProgress = function(time){
		this.greenprogressbar.alpha = this.greenprogressSlider.alpha = 0;
		this.blueprogressbar.alpha = this.blueprogressSlider.alpha = 0;
		this.redprogressbar.alpha = this.redprogressSlider.alpha = 0;
		this.yellowprogressbar.alpha = this.yellowprogressSlider.alpha = 0;
		this.purpleprogressbar.alpha = this.purpleprogressSlider.alpha = 1;
		this.startTimer(time);
	};

	PowerupProgress.prototype.startTimer = function(time){
		this.hideProgressBar = false;
		this.timerValue = Math.round(time/milisec);
		this.currentTimerValue = 0;
		var self = this;
		self.greenprogressSlider.x = self.blueprogressSlider.x = self.redprogressSlider.x = self.yellowprogressSlider.x = self.purpleprogressSlider.x = - canvasWidth;

		this.timer = setInterval(function(){

			if (self.currentTimerValue > self.timerValue) {
				clearInterval(self.timer);
				self.hideProgressBar = true;
				
			}else{
				self.greenprogressSlider.x = self.blueprogressSlider.x = self.redprogressSlider.x = self.yellowprogressSlider.x = self.purpleprogressSlider.x = - canvasWidth + (canvasWidth* (self.currentTimerValue/self.timerValue));
				self.currentTimerValue ++;				
			}

		}, milisec);
	};

	PowerupProgress.prototype.reset = function(){
		this.currentTimerValue = 0;
		this.hideProgressBar = true;
		this.powerupProgress.y = (canvasHeight+1);
	};

	PowerupProgress.prototype.update = function(){
		if (this.hideProgressBar) {
			this.powerupProgress.y += ((canvasHeight+1) - this.powerupProgress.y)*0.1;
		}else{
			this.powerupProgress.y += ((canvasHeight-30) - this.powerupProgress.y)*0.1;
		}
	};

	return PowerupProgress;

})();

var Score = (function(){

	function Score() {
		_.bindAll(this);
		this.enableScoreEdit = true;
		this.init();
	}

	Score.prototype.init = function() {
		this.score = 0;
	};

	Score.prototype.updateScore = function(value){
		if (this.enableScoreEdit) {
			this.score += value /2;
			this.score = Math.round(this.score);
			$('#scoreValue').html(this.score);
		}
	};

	Score.prototype.reset = function(){
		this.score = 0;
		this.enableScoreEdit = true;
		$('#scoreValue').html(this.score);
	};

	return Score;

})();

/*globals io:true */

var SocketConnection = (function(){

	var connectionEstablished = false;
	var currentBoardColor = 'currentColor';

	function SocketConnection() {
		_.bindAll(this);
	}

	SocketConnection.prototype.init = function() {
		this.socket = io.connect(':1337');

		var self = this;
		
		this.socket.on('horizontalPosition', function(data) {
			bean.fire(self, 'horizontalPosition', data);
		});

		this.socket.on('jump', function(data) {
			if (data) {
				bean.fire(self, 'jump');
			}
		});

		this.socket.on('weight', function(data) {
			if (data) {
				bean.fire(self, 'weightReceived', data);
			}
		});

		this.socket.on('disconnect', function(data){
			console.log('server shut down');
			//bean.fire(self, 'cancelConnection');
		});

		this.socket.on('otherUserConnected', function(data) {
			if (!data && !connectionEstablished) {
				connectionEstablished = true;
				bean.fire(self, 'connectionOk');
			}else if(!connectionEstablished){
				this.socket.disconnect();
				bean.fire(self, 'cancelConnection');
			}else{
				console.log('server reconnected');
			}	
		});
	};

	SocketConnection.prototype.askForWeight = function(){
		this.socket.emit('askForWeight');
	};

	SocketConnection.prototype.setBoardColor = function(color){
		if (color !== currentBoardColor) {
			console.log('set board color: ' + color);
			this.socket.emit('setBoardColor', color);	
		}else{
			console.log('board is already ' + color);
		}

		currentBoardColor = color;
		
	};

	SocketConnection.prototype.setBoardColorByRGB = function(red, green, blue){
		this.socket.emit('setBoardColor', red, green, blue);
	};

	return SocketConnection;
})();

/* globals buzz:true */

var Sound = (function(){

	var muted = false;

	function Sound() {
		_.bindAll(this);
		this.init();
	}

	Sound.prototype.init = function() {
		buzz.defaults.preload = 'auto';
		buzz.defaults.autoplay = true;
		buzz.defaults.formats = ['mp3', 'ogg'];
	};

	Sound.prototype.toggleMute = function(){
		console.log('toggle mute');
		/*for (var i = 0; i < buzz.sounds.length; i++) {
			buzz.sounds[i].toggleMute();
		}*/	
		muted = !muted;

		if (muted) {
			$('#mute').removeClass('unmuted').addClass('muted');
			buzz.all().mute();	
		}else{
			$('#mute').removeClass('muted').addClass('unmuted');
			buzz.all().unmute();	
		}
		
	};

	Sound.prototype.playEffectWithVolume = function(soundName, volume) {
		//buzz.defaults.loop = false;
		var effectSound = new buzz.sound('../sound/' + soundName);
		if (!muted) {
			effectSound.setVolume(volume);	
		}else{
			effectSound.setVolume(0);	
		}
		
		effectSound.play();
	};

	Sound.prototype.playBackgroundMusic = function(soundName) {		
		var backgroundMusic = new buzz.sound('../sound/' + soundName);
		backgroundMusic.setVolume(40);
		//backgroundMusic.loop();
		backgroundMusic.play();

		backgroundMusic.bind('timeupdate', function(event) {
			var time = this.getTime();
			var duration = this.getDuration();

			if (time > duration-0.7 ) {
				if (backgroundMusic) {
					backgroundMusic.stop();	
					backgroundMusic.play();
				}
			}
		});
	};

	Sound.prototype.changeRocketVolume = function(value){
		var soundVolume = Math.round(Math.abs(value));

		if (!muted) {
			this.rocketSound.setVolume(soundVolume*8);
		}else{
			this.rocketSound.setVolume(0);
		}
		
	};

	Sound.prototype.playRocketSound = function(soundName) {
		this.rocketSound = new buzz.sound('../sound/' + soundName);
		this.rocketSound.setVolume(0);
		this.rocketSound.loop();
		this.rocketSound.play();

		this.rocketSound.bind('timeupdate', function(event) {

			var time = this.getTime();
			var duration = this.getDuration();

			if (time > duration-0.7 ) {
				if (this.rocketSound) {
					this.rocketSound.stop();
					this.rocketSound.play();
				}				
			}
			//rocketSound.play();
		});
	};

	return Sound;

})();

/*globals  Bullet:true */

var SpaceShip = (function(){

	var bullets = [];
	var bullet;
	var flameFlickerTimer = 0;
	var setStartPos = false;
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
		this.smallerMode = false;
		this.biggerMode = false;
		this.ship.alpha = 0;
		setStartPos = false;
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

			if (!setStartPos) {
				this.ship.y += 200;
				setStartPos = true;
			}else{
				this.ship.y += (this.y-this.ship.y)*0.05;	
			}

			

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
				this.ship.scaleX = this.ship.scaleY += (0.3-this.ship.scaleX)*0.015;
			}else{
				this.ship.scaleX = this.ship.scaleY += (1-this.ship.scaleX)*0.015;
			}

			if (this.biggerMode) {
				this.ship.scaleX = this.ship.scaleY += (1.8 - this.ship.scaleX)*0.015;
			}else{
				this.ship.scaleX = this.ship.scaleY += (1-this.ship.scaleX)*0.015;
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

/*globals Powerup:true, Meteorite:true, SpaceShip:true */

var StartScreen = (function(){

	var canvasWidth = 0;
	var canvasHeight = 0;

	function StartScreen() {
		_.bindAll(this);
		this.init();
		//$(document).on('click', this.restartGame);
	}

	StartScreen.prototype.init = function() {

		$('#score').hide();

		canvasWidth = $('#cnvs').width() +5;
		canvasHeight = $('#cnvs').height()+5;

		this.startContainer = new createjs.Container();

		this.backgroundImage = new createjs.Bitmap('images/blueBG.png');
		this.backgroundImage.alpha = 0.25;
		//this.backgroundImage.scaleX = this.backgroundImage.scaleY = 3;

		this.text = new createjs.Text('space evader', '48px CFSpaceship', '#FFFFFF');
		this.text.x = (canvasWidth - this.text.getBounds().width)/2;
		this.text.y = 70;

		this.line = new createjs.Shape();
		this.line.graphics.beginStroke('#ffffff');
		this.line.graphics.setStrokeStyle(2);
		this.line.graphics.moveTo(0,0);
		this.line.graphics.lineTo(canvasWidth-60, 0);
		this.line.x = 30;
		this.line.y = 130;
		this.line.shadow = new createjs.Shadow('#00ADEE', 0, 0, 10);

		this.leunText = new createjs.Text('Leun links en rechts om je raket te besturen', '18px ralewayLight', '#FFFFFF');
		this.leunText.x = -60;
		this.leunText.y = 150;

		var yOffset = -50;
		var canvasPerc = (canvasHeight*0.68);

		this.verzamelText = new createjs.Text('Verzamel', '18px ralewayLight', '#FFFFFF');
		this.verzamelText.x = 60;
		this.verzamelText.y = canvasPerc + yOffset;

		this.verzamelLine = new createjs.Shape();
		this.verzamelLine.graphics.beginStroke('#ffffff');
		this.verzamelLine.graphics.setStrokeStyle(2);
		this.verzamelLine.graphics.moveTo(0,0);
		this.verzamelLine.graphics.lineTo(canvasWidth*0.33, 0);
		this.verzamelLine.x = 60;
		this.verzamelLine.y = canvasPerc +30 + yOffset;
		this.verzamelLine.shadow = new createjs.Shadow('#00ADEE', 0, 0, 10);

		this.ontwijkText = new createjs.Text('Ontwijk', '18px ralewayLight', '#FFFFFF');
		this.ontwijkText.x = canvasWidth - 60 - this.ontwijkText.getBounds().width;
		this.ontwijkText.y = canvasPerc+ yOffset;

		this.ontwijkLine = new createjs.Shape();
		this.ontwijkLine.graphics.beginStroke('#ffffff');
		this.ontwijkLine.graphics.setStrokeStyle(2);
		this.ontwijkLine.graphics.moveTo(0,0);
		this.ontwijkLine.graphics.lineTo(canvasWidth*0.33, 0);
		this.ontwijkLine.x = canvasWidth - 60 - canvasWidth*0.33;
		this.ontwijkLine.y = canvasPerc + 30 + yOffset;
		this.ontwijkLine.shadow = new createjs.Shadow('#00ADEE', 0, 0, 10);

		//afbeeldingen hier!
		var warpPowerup = new Powerup();
		warpPowerup.init('warp');
		warpPowerup.powerup.x = 60+25;
		warpPowerup.powerup.y = canvasPerc + 80 + yOffset;
		warpPowerup.powerup.scaleX = warpPowerup.powerup.scaleY = 0.75;
		

		var shootPowerup = new Powerup();
		shootPowerup.init('shoot');
		shootPowerup.powerup.x = 60+25+60;
		shootPowerup.powerup.y = canvasPerc + 80+ yOffset;
		shootPowerup.powerup.scaleX = shootPowerup.powerup.scaleY = 0.75;

		var smallerPowerup = new Powerup();
		smallerPowerup.init('smaller');
		smallerPowerup.powerup.x = 60+25+60+60;
		smallerPowerup.powerup.y = canvasPerc + 80+ yOffset;
		smallerPowerup.powerup.scaleX = smallerPowerup.powerup.scaleY = 0.75;

		var reversePowerup = new Powerup();
		reversePowerup.init('reverse');
		reversePowerup.powerup.x = canvasWidth - 60 - 25 - 60;
		reversePowerup.powerup.y = canvasPerc + 80+ yOffset;
		reversePowerup.powerup.scaleX = reversePowerup.powerup.scaleY = 0.75;

		var biggerPowerup = new Powerup();
		biggerPowerup.init('bigger');
		biggerPowerup.powerup.x = canvasWidth - 60 - 25 - 60 - 60;
		biggerPowerup.powerup.y = canvasPerc + 80+ yOffset;
		biggerPowerup.powerup.scaleX = biggerPowerup.powerup.scaleY = 0.75;

		var meteorite = new Meteorite();
		meteorite.init();
		meteorite.meteorite.x = canvasWidth - 60 - 25;
		meteorite.meteorite.y = canvasPerc+80+ yOffset;
		meteorite.meteorite.scaleX = meteorite.meteorite.scaleY = 0.75;

		this.jumpText = new createjs.Text('Spring om te beginnen', '25px ralewayLight', '#FFFFFF');		
		this.jumpText.y = canvasHeight - 60;
		this.jumpText.x = (canvasWidth - this.jumpText.getBounds().width)/2;

		this.ventjeContainer = new createjs.Container();

		this.ventje = new createjs.Shape();
		this.ventje.x = 0;
		this.ventje.y = 0;
		this.ventje.graphics.beginStroke('#00d2ff');
		this.ventje.graphics.setStrokeStyle(2);
		// this.ventje.graphics.moveTo(0,104);
		// this.ventje.graphics.lineTo(97,104);
		// this.ventje.graphics.lineTo(77,84);
		// this.ventje.graphics.lineTo(20,84);
		// this.ventje.graphics.lineTo(0,104);

		this.ventje.graphics.moveTo(0,97);
		this.ventje.graphics.lineTo(6,104);
		this.ventje.graphics.lineTo(48.5,100);

		this.ventje.graphics.lineTo(91,104);
		this.ventje.graphics.lineTo(97,97);

		this.ventje.graphics.lineTo(77,84);
		this.ventje.graphics.lineTo(48.5,78);
		this.ventje.graphics.lineTo(20,84);
		this.ventje.graphics.lineTo(0,97);
		
		this.ventje.graphics.endStroke();
		this.ventje.graphics.beginStroke('#ffffff');
		this.ventje.graphics.moveTo(39,94);
		this.ventje.graphics.lineTo(37,77);
		this.ventje.graphics.lineTo(50,63);
		this.ventje.graphics.lineTo(62,77);
		this.ventje.graphics.lineTo(59,94);
		this.ventje.graphics.moveTo(50,63);
		this.ventje.graphics.lineTo(45,36);
		this.ventje.graphics.lineTo(37,23);
		this.ventje.graphics.moveTo(22,27);
		this.ventje.graphics.lineTo(31,36);
		this.ventje.graphics.lineTo(45,36);
		this.ventje.graphics.lineTo(56,25);
		this.ventje.graphics.lineTo(56,11);
		this.ventje.graphics.endFill();
		//this.ventje.graphics.moveTo(100,100);
		//this.ventje.graphics.arc(13, 80, 30, 180, -Math.PI/3);

		// this.ventje.graphics.endFill();
		// this.ventje.graphics.arc(80, 80, 30, 180, -Math.PI/3);

		this.ventje.graphics.beginStroke('#ffffff');
		//this.ventje.graphics.moveTo(32,12);
		this.ventje.graphics.drawCircle(32,12, 12);
		this.ventje.graphics.endFill();
		this.ventje.shadow = new createjs.Shadow('#00ADEE', 0, 0, 10);

		this.ventje2 = this.ventje.clone();
		this.ventje2.x = 250;
		this.ventje2.scaleX *= -1;

		var leftSpaceShip = new SpaceShip(0,0, false, false);
		leftSpaceShip.ship.rotation = -25;
		leftSpaceShip.ship.x = -10;
		leftSpaceShip.ship.y = 40;
		leftSpaceShip.ship.scaleX = leftSpaceShip.ship.scaleY = 0.8;

		var rightSpaceShip = new SpaceShip(0,0,false, false);
		rightSpaceShip.ship.rotation = 25;
		rightSpaceShip.ship.y = 40;
		rightSpaceShip.ship.x = 259;
		rightSpaceShip.ship.scaleX = rightSpaceShip.ship.scaleY = 0.8;

		var jumpOffset = 20;
		this.jump = new createjs.Shape();
		this.jump.x = 0;
		this.jump.y = 0;
		this.jump.graphics.beginStroke('#00d2ff');
		this.jump.graphics.setStrokeStyle(3);

		this.jump.graphics.moveTo(0,97);
		this.jump.graphics.lineTo(6,104);
		this.jump.graphics.lineTo(48.5,100);

		this.jump.graphics.lineTo(91,104);
		this.jump.graphics.lineTo(97,97);

		this.jump.graphics.lineTo(77,84);
		this.jump.graphics.lineTo(48.5,78);
		this.jump.graphics.lineTo(20,84);
		this.jump.graphics.lineTo(0,97);

		this.jump.graphics.endStroke();
		this.jump.graphics.beginStroke('#ffffff');
		this.jump.graphics.moveTo(29,94-jumpOffset);
		this.jump.graphics.lineTo(37,77-jumpOffset);
		this.jump.graphics.lineTo(50,63-jumpOffset);
		this.jump.graphics.lineTo(62,77-jumpOffset);
		this.jump.graphics.lineTo(69,94-jumpOffset);
		this.jump.graphics.moveTo(50,63-jumpOffset);
		this.jump.graphics.lineTo(50,29-jumpOffset);
		//this.jump.graphics.lineTo(37,23);
		this.jump.graphics.moveTo(27,32-jumpOffset);
		this.jump.graphics.lineTo(36,41-jumpOffset);
		this.jump.graphics.lineTo(50,41-jumpOffset);
		this.jump.graphics.lineTo(64,41-jumpOffset);
		this.jump.graphics.lineTo(73,32-jumpOffset);

		this.jump.graphics.endStroke();
		this.jump.graphics.beginStroke('#fff448');

		this.jump.graphics.moveTo(37,77+25-jumpOffset);
		this.jump.graphics.lineTo(50,63+25-jumpOffset);
		this.jump.graphics.lineTo(62,77+25-jumpOffset);

		this.jump.graphics.moveTo(37,77+35-jumpOffset);
		this.jump.graphics.lineTo(50,63+35-jumpOffset);
		this.jump.graphics.lineTo(62,77+35-jumpOffset);

		// this.jump.graphics.lineTo(56,25);
		// this.jump.graphics.lineTo(56,11);
		this.jump.graphics.endFill();
		this.jump.graphics.beginStroke('#ffffff');
		this.jump.graphics.drawCircle(50, 17-jumpOffset, 12);
		this.jump.graphics.endFill();
		this.jump.x = (canvasWidth / 2)-(35*this.jump.scaleX);
		this.jump.y = this.jumpText.y - 80;
		this.jump.shadow = new createjs.Shadow('#00ADEE', 0, 0, 10);
		this.jump.scaleX = this.jump.scaleY = 0.7;

		this.ventjeContainer.addChild(this.ventje);
		this.ventjeContainer.addChild(this.ventje2);
		this.ventjeContainer.addChild(this.leunText);
		this.ventjeContainer.addChild(leftSpaceShip.ship);
		this.ventjeContainer.addChild(rightSpaceShip.ship);

		this.ventjeContainer.x = (canvasWidth-250)/2;
		this.ventjeContainer.y = canvasHeight * 0.27;

		this.startContainer.x = 0;
		this.startContainer.y = 0;
		this.startContainer.addChild(this.backgroundImage);
		this.startContainer.addChild(warpPowerup.powerup);
		this.startContainer.addChild(shootPowerup.powerup);
		this.startContainer.addChild(smallerPowerup.powerup);
		this.startContainer.addChild(biggerPowerup.powerup);
		this.startContainer.addChild(meteorite.meteorite);
		this.startContainer.addChild(reversePowerup.powerup);
		this.startContainer.addChild(this.text);
		this.startContainer.addChild(this.jumpText);
		this.startContainer.addChild(this.line);
		this.startContainer.addChild(this.verzamelText);
		this.startContainer.addChild(this.verzamelLine);
		this.startContainer.addChild(this.ontwijkText);
		this.startContainer.addChild(this.ontwijkLine);
		this.startContainer.addChild(this.warpImage);
		this.startContainer.addChild(this.jump);
		this.startContainer.addChild(this.ventjeContainer);

	};

	StartScreen.prototype.restartGame = function(e) {
		var self = this;
		$(document).off('click', this.restartGame);
		bean.fire(this, 'startGame');
	};

	return StartScreen;

})();

var Timer = (function(){

	var myTimer;
	var eventTimer = 1;
	var numberOfEvents = 3;

	function Timer() {
		_.bindAll(this);
		this.timerValue = 60;
		this.isRunning = false;
		this.timer = this.timerValue;
		numberOfEvents = Math.floor(this.timerValue/10);

		//$('#timer p').html(this.timer);
	}

	Timer.prototype.start = function() {
		console.log('[TIMER] start timer');
		this.timer = this.timerValue;
		this.isRunning = true;
		eventTimer = 1;
		this.update();
		myTimer =  setInterval(this.update, 1000);
	};

	Timer.prototype.stop = function() {
		console.log('[TIMER] stop timer');
		$('#timer p').html('');
		this.isRunning = false;
		clearInterval(myTimer);
	};

	Timer.prototype.update = function() {
		$('#timer p').html(this.timer);

		bean.fire(this, 'secondPast');

		if(this.timer <= 0) {
			this.stop();
			bean.fire(this, 'endTimer');
		}else if(this.timer < (this.timerValue / numberOfEvents) * (numberOfEvents-eventTimer)){			
			eventTimer ++;
			bean.fire(this, 'speedUpMeteorites');
		}

		if (this.timer <= 10) {

			if (this.timer <= 3) {
				if (this.timer !== 0) {
					bean.fire(this, 'beep', 'double');	
				}
			}else{
				bean.fire(this, 'beep', 'single');
			}
		}

		this.timer --;
	};

	return Timer;

})();

/* globals Main:true */

var main = new Main($('#container'));
main.init();

})();
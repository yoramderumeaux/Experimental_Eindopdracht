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

		this.restartGame();
	};

	StartScreen.prototype.restartGame = function(e) {
		var self = this;
		$(document).off('click', this.restartGame);
		bean.fire(this, 'startGame');
	};

	return StartScreen;

})();
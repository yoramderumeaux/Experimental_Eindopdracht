/*globals Powerup:true, Meteorite:true */

var StartScreen = (function(){

	var canvasWidth = 0;
	var canvasHeight = 0;

	function StartScreen() {
		_.bindAll(this);
		this.init();
	}

	StartScreen.prototype.init = function() {

		canvasWidth = $('#cnvs').width() +5;
		canvasHeight = $('#cnvs').height()+5;

		this.startContainer = new createjs.Container();

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
		this.leunText.x = (canvasWidth - this.leunText.getBounds().width)/2;
		this.leunText.y = 300;

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
		this.startContainer.addChild(warpPowerup.powerup);

		var shootPowerup = new Powerup();
		shootPowerup.init('shoot');
		shootPowerup.powerup.x = 60+25+75;
		shootPowerup.powerup.y = canvasPerc + 80+ yOffset;
		this.startContainer.addChild(shootPowerup.powerup);

		var reversePowerup = new Powerup();
		reversePowerup.init('reverse');
		reversePowerup.powerup.x = canvasWidth - 60 - 25 - 75;
		reversePowerup.powerup.y = canvasPerc + 80+ yOffset;
		this.startContainer.addChild(reversePowerup.powerup);

		var meteorite = new Meteorite();
		meteorite.init();
		meteorite.meteorite.x = canvasWidth - 60 - 25;
		meteorite.meteorite.y = canvasPerc+80+ yOffset;
		this.startContainer.addChild(meteorite.meteorite);

		this.jumpText = new createjs.Text('Spring om te beginnen', '25px ralewayLight', '#FFFFFF');		
		this.jumpText.y = canvasHeight - 80;
		this.jumpText.x = (canvasWidth - this.jumpText.getBounds().width)/2;

		this.startContainer.x = 0;
		this.startContainer.y = 0;
		this.startContainer.addChild(this.text);
		this.startContainer.addChild(this.jumpText);
		this.startContainer.addChild(this.line);
		this.startContainer.addChild(this.leunText);
		this.startContainer.addChild(this.verzamelText);
		this.startContainer.addChild(this.verzamelLine);
		this.startContainer.addChild(this.ontwijkText);
		this.startContainer.addChild(this.ontwijkLine);
		this.startContainer.addChild(this.warpImage);

	};

	return StartScreen;

})();
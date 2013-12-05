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

		this.jumpText = new createjs.Text('Spring om te beginnen', '25px ralewayLight', '#FFFFFF');		
		this.jumpText.y = canvasHeight - 80;
		this.jumpText.x = (canvasWidth - this.jumpText.getBounds().width)/2;

		var jumpOffset = 20;
		this.jump = new createjs.Shape();
		this.jump.x = 0;
		this.jump.y = 0;
		this.jump.graphics.beginStroke('#00d2ff');
		this.jump.graphics.setStrokeStyle(3);
		this.jump.graphics.moveTo(0,104);
		this.jump.graphics.lineTo(97,104);
		this.jump.graphics.lineTo(77,84);
		this.jump.graphics.lineTo(20,84);
		this.jump.graphics.lineTo(0,104);
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
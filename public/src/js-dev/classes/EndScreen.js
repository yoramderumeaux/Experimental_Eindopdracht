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

		if(this.died) {
			this.congratsText = new createjs.Text('Jammer, je haalde het net niet!', '25px ralewayLight', '#E75F5F');
			this.congratsText.x = (canvasWidth - this.congratsText.getBounds().width)/2;
			this.congratsText.y = ((canvasHeight - this.congratsText.getBounds().height)/2) - 50;
		}else {
			this.congratsText = new createjs.Text('Proficiat! Je haalde het einde!', '25px ralewayLight', '#63DF76');
			this.congratsText.x = (canvasWidth - this.congratsText.getBounds().width)/2;
			this.congratsText.y = ((canvasHeight - this.congratsText.getBounds().height)/2) - 50;
		}

		this.text2 = new createjs.Text('Je behaalde een score van', '25px ralewayLight', '#FFFFFF');
		this.text2.x = (canvasWidth - this.text2.getBounds().width)/2;
		this.text2.y = ((canvasHeight - this.text2.getBounds().height)/2) + 30;

		this.scoreText = new createjs.Text(this.endScore, '50px menschWeb', '#FFFFFF');
		this.scoreText.x = (canvasWidth - this.scoreText.getBounds().width)/2;
		this.scoreText.y = ((canvasHeight - this.scoreText.getBounds().height)/2) + 100;

		this.jumpText = new createjs.Text('Spring om te beginnen', '25px ralewayLight', '#FFFFFF');		
		this.jumpText.y = canvasHeight - 80;
		this.jumpText.x = (canvasWidth - this.jumpText.getBounds().width)/2;

		this.endContainer.addChild(this.backgroundImage);
		this.endContainer.addChild(this.text);
		this.endContainer.addChild(this.text2);
		this.endContainer.addChild(this.congratsText);
		this.endContainer.addChild(this.line);
		this.endContainer.addChild(this.jumpText);
		this.endContainer.addChild(this.scoreText);	
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
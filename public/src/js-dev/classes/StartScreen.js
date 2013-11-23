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

		this.text = new createjs.Text('game name', 'bold 36px Arial', '#FFFFFF');
		this.text.x = (canvasWidth - this.text.getBounds().width)/2;

		//afbeeldingen hier!

		this.jumpText = new createjs.Text('Spring om te beginnen', 'bold 30px Arial', '#FFFFFF');		
		this.jumpText.y = 250;
		this.jumpText.x = (canvasWidth - this.jumpText.getBounds().width)/2;


		this.startContainer.x = 0;
		this.startContainer.y = 0;
		this.startContainer.addChild(this.text);
		this.startContainer.addChild(this.jumpText);
	};

	return StartScreen;

})();
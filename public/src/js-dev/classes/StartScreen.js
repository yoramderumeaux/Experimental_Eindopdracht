var StartScreen = (function(){

	function StartScreen() {
		_.bindAll(this);
		this.init();
	}

	StartScreen.prototype.init = function() {

		this.endContainer = new createjs.Container();

		this.text = new createjs.Text('Tis gedaan', 'bold 36px Arial', '#FFFFFF');

		this.endContainer.x = 100;
		this.endContainer. y = 100;
		this.endContainer.addChild(this.text);
	};

	return StartScreen;

})();
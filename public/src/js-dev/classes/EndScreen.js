var EndScreen = (function(){

	function EndScreen(endScore) {
		_.bindAll(this);
		

		this.endScore = endScore;
		console.log(this.endScore);

		this.init();

		$(document).on('click', this.restartGame);
	}

	EndScreen.prototype.init = function() {

		this.endContainer = new createjs.Container();

		this.text = new createjs.Text('Tis gedaan', 'bold 36px Arial', '#FFFFFF');
		this.scoreText = new createjs.Text(this.endScore, 'bold 36px Arial', '#FFFFFF');
		this.scoreText.y = 40;

		this.endContainer.x = 100;
		this.endContainer.y = 100;
		this.endContainer.addChild(this.text);
		this.endContainer.addChild(this.scoreText);
	};

	EndScreen.prototype.restartGame = function(e) {
		var self = this;
		bean.fire(this, 'restartGame');
	};

	return EndScreen;

})();
var EndScreen = (function(){

	function EndScreen() {
		_.bindAll(this);
		this.init();

		$(document).on('click', this.restartGame);
	}

	EndScreen.prototype.init = function() {

		this.endContainer = new createjs.Container();

		var text = new createjs.Text('Tis gedaan', 'bold 36px Arial', '#00FF00');

		this.endContainer.x = 100;
		this.endContainer. y = 100;
		this.endContainer.addChild(text);
	};

	EndScreen.prototype.restartGame = function(e) {
		var self = this;
		bean.fire(this, 'restartGame');
	};

	return EndScreen;

})();
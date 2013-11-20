var Score = (function(){

	function Score() {
		_.bindAll(this);
	}

	Score.prototype.init = function() {
		this.score = 0;
		console.log('start score timer');
	};

	Score.prototype.updateScore = function(value){
		this.score += value;
		$('#scoreValue').html(Math.round(this.score / 10));
	};

	Score.prototype.reset = function(){
		this.score = 0;
		$('#scoreValue').html(this.score);
	};

	Score.prototype.showScore = function(){
		//window.alert(Math.round(this.score / 10));
	};

	return Score;

})();
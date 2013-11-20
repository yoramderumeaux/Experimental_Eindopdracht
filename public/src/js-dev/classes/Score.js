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
			this.score += value;
			$('#scoreValue').html(Math.round(this.score / 10));
		}
	};

	Score.prototype.reset = function(){
		this.score = 0;
		this.enableScoreEdit = true;
		$('#scoreValue').html(this.score);
	};

	Score.prototype.showScore = function(){
		//window.alert(Math.round(this.score / 10));
	};

	return Score;

})();
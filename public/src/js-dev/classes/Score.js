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
			this.score += value /2;
			this.score = Math.round(this.score);
			$('#scoreValue').html(this.score);
		}
	};

	Score.prototype.reset = function(){
		this.score = 0;
		this.enableScoreEdit = true;
		$('#scoreValue').html(this.score);
	};

	return Score;

})();
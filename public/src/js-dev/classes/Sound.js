/* globals buzz:true */

var Sound = (function(){

	function Sound() {
		_.bindAll(this);
		this.init();
	}

	Sound.prototype.init = function() {
		buzz.defaults.preload = 'auto';
		buzz.defaults.autoplay = false;
		buzz.defaults.formats = ['mp3', 'ogg'];
	};

	Sound.prototype.playEffect = function(soundName) {
		buzz.defaults.loop = false;
		var effectSound = new buzz.sound('../sound/' + soundName);
		effectSound.play();
	};

	Sound.prototype.playBackgroundMusic = function(soundName) {
		buzz.defaults.loop = true;
		var backgroundMusic = new buzz.sound('../sound/' + soundName);
		backgroundMusic.play();
	};

	return Sound;

})();
/* globals buzz:true */

var Sound = (function(){

	function Sound() {
		_.bindAll(this);
		this.init();
	}

	Sound.prototype.init = function() {
		buzz.defaults.preload = 'auto';
		buzz.defaults.autoplay = true;
		buzz.defaults.formats = ['mp3', 'ogg'];
	};

	Sound.prototype.toggleMute = function(){
		for (var i = 0; i < buzz.sounds.length; i++) {
			buzz.sounds[i].toggleMute();
		}
	};

	Sound.prototype.playEffectWithVolume = function(soundName, volume) {
		//buzz.defaults.loop = false;
		var effectSound = new buzz.sound('../sound/' + soundName);
		effectSound.setVolume(volume);
		effectSound.play();
	};

	Sound.prototype.playBackgroundMusic = function(soundName) {		
		var backgroundMusic = new buzz.sound('../sound/' + soundName);
		backgroundMusic.setVolume(40);
		backgroundMusic.loop();
		backgroundMusic.play();

		backgroundMusic.bind('timeupdate', function(event) {
			var time = this.getTime();
			var duration = this.getDuration();

			if (time > duration-0.7 ) {
				if (backgroundMusic) {
					backgroundMusic.stop();	
					backgroundMusic.play();
				}
			}
		});
	};

	Sound.prototype.changeRocketVolume = function(value){
		var soundVolume = Math.round(Math.abs(value));
		this.rocketSound.setVolume(20 + (soundVolume*8));
	};

	Sound.prototype.playRocketSound = function(soundName) {
		this.rocketSound = new buzz.sound('../sound/' + soundName);
		this.rocketSound.setVolume(0);
		this.rocketSound.loop();
		this.rocketSound.play();

		this.rocketSound.bind('timeupdate', function(event) {

			var time = this.getTime();
			var duration = this.getDuration();

			if (time > duration-0.7 ) {
				if (this.rocketSound) {
					this.rocketSound.stop();
					this.rocketSound.play();
				}				
			}
			//rocketSound.play();
		});
	};

	return Sound;

})();
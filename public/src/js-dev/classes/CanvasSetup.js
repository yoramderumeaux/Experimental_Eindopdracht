var CanvasSetup = (function(){

	var canvasHeight, canvasWidth;
	var aspectRatio;

	function CanvasSetup($canvasElement, ratio) {
		_.bindAll(this);
		this.$canvasElement = $canvasElement;
		aspectRatio = ratio;
	}

	CanvasSetup.prototype.init = function() {
		canvasHeight = $('body').height();
		canvasWidth = canvasHeight/aspectRatio;
		this.$canvasElement.css('width', canvasWidth);
	};


	return CanvasSetup;

})();
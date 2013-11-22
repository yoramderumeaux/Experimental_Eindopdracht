var CollisionDetection = (function(){

	function CollisionDetection() {

	}

	CollisionDetection.checkCollisionCenterAnchor = function(shapeA, shapeB) {

		var vX = shapeA.x - shapeB.x;
		var vY = shapeA.y - shapeB.y;
		var distance = Math.sqrt(Math.pow(vX, 2) + Math.pow(vY,2));

		var shapeAWidth = Math.min(shapeA.width/2, shapeA.height/2);
		var shapeBWidth = Math.min(shapeB.width/2, shapeB.height/2);

		// var hWidths = (shapeA.width/2) + (shapeB.width/2);	
		// var hHeight = (shapeA.height/2) + (shapeB.height/2);

		// Collision
		// if(Math.abs(vX) < hWidths && Math.abs(vY) < hHeight) {
		// return 'hit';	
		// }

		if (distance < (shapeAWidth+shapeBWidth)) {
			return 'hit';
		}

		return 'noHit';

	};
	
	return CollisionDetection;

})();
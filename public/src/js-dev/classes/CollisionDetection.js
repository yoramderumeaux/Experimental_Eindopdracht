var CollisionDetection = (function(){

	function CollisionDetection() {

	}

	CollisionDetection.checkCollisionCenterAnchor = function(shapeA, shapeB) {
		//console.log(shapeA.height);

		var vX = shapeA.x - shapeB.x;
		var vY = shapeA.y - shapeB.y;

		var hWidths = (shapeA.width/2) + (shapeB.width/2);	
		var hHeight = (shapeA.height/2) + (shapeB.height/2);

		// Collision
		if(Math.abs(vX) < hWidths && Math.abs(vY) < hHeight) {
			return 'hit';	
		}

		return 'noHit';

	};

	CollisionDetection.sayHello = function(){
		console.log('say hello');
	};

	return CollisionDetection;

})();
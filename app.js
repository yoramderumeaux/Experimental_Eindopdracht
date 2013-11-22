// Express - start server and init socket.io
// surf naar localhost:1337

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public/src'));
app.get('/', function(req, res){
	res.sendfile(__dirname + '/public/src/index.html'); 
});

var clientIDs = [];
var gameClient;

var server = require('http').createServer(app); 
var io = require('socket.io').listen(server); 
io.set('log level', 1); // reduce logging
server.listen(1337);

io.sockets.on('connection', function(socket){ 
	
	if (clientIDs.length === 0) {
		gameClient = socket;
		gameClient.emit('otherUserConnected', false);
	}else{
		socket.emit('otherUserConnected', true);
	}

	clientIDs.push(socket.id);
	console.log(clientIDs.length + ' user(s) connected');

	socket.on('disconnect', function () {
		clientIDs.splice(clientIDs.indexOf(this.id), 1);
		console.log(clientIDs.length + ' user(s) remaining');
    });
});

// Require the firmata depenency
var firmata = require('firmata');
var path = '/dev/tty.usbmodemfa131';

//program variables
var leftSensorTopPin =  0;
var leftSensorBottomPin = 1;
var rightSensorTopPin = 2;
var rightSensorBottomPin = 3;

var dataLed = 3;
var activeLed = 2;

var leftSensorTopMin = 0;
var leftSensorTopMax = 1023; //max 1023
var leftSensorTopVal = 0;
var leftSensorBottomMin = 0;
var leftSensorBottomMax = 1023; //max 1023
var leftSensorBottomVal = 0;

var rightSensorTopMin = 0;
var rightSensorTopMax = 1023; //max 1023
var rightSensorTopVal = 0;
var rightSensorBottomMin = 0;
var rightSensorBottomMax = 1023; //max 1023
var rightSensorBottomVal = 0;

var leftJumpLog = [];
var rightJumpLog = [];
var jumpThreshold = 30;
var jumpIntervalTime = 1000; //ms

var board = new firmata.Board(path, function(err){
	if(err){ 
		console.log(err); 	
		return;
	}
	console.log('arduino connected'); 

	// Sensors
	board.pinMode(leftSensorTopPin, board.MODES.INPUT);
	board.pinMode(leftSensorBottomPin, board.MODES.INPUT);
	board.pinMode(rightSensorTopPin, board.MODES.INPUT);
	board.pinMode(rightSensorBottomPin, board.MODES.INPUT);

	// Ledjes
	board.pinMode(2, board.MODES.OUTPUT);
	board.pinMode(3, board.MODES.OUTPUT);

	var ledOn = true; 

	setInterval(function(){
		board.digitalWrite(activeLed, board.HIGH);
		setTimeout(function(){
			board.digitalWrite(activeLed, board.LOW);
		}, 20);
	}, 1000);

	setInterval(checkForJump, jumpIntervalTime);

	board.analogRead(leftSensorTopPin, readLeftTopButton);
	board.analogRead(leftSensorBottomPin, readLeftBottomButton);
	board.analogRead(rightSensorTopPin, readRightTopButton);
	board.analogRead(rightSensorBottomPin, readRightBottomButton);
});

function checkForJump(){

	//wait for more than 30 registered values
	if (Math.min(leftJumpLog.length, rightJumpLog.length) > 30) {
		var minLeft = 100000;
		var maxLeft = 0;
		var minRight = 100000;
		var maxRight = 0;

		//define min and max
		for (var i = 0; i < leftJumpLog.length; i++) {
			maxLeft = Math.max(maxLeft, leftJumpLog[i]);
			minLeft = Math.min(minLeft, leftJumpLog[i]);	
		};

		//define min and max
		for (var i = 0; i < rightJumpLog.length; i++) {
			maxRight = Math.max(maxRight, rightJumpLog[i]);
			minRight = Math.min(minRight, rightJumpLog[i]);		
		};

		console.log(minLeft, maxLeft, minRight, maxRight);

		if (maxLeft - minLeft > jumpThreshold && maxRight - minRight > jumpThreshold) {		
			emitSocket('jump', true);	
		};
	}

	//empty jump log
	leftJumpLog = [];
	rightJumpLog = [];

	//console.log(rightJumpLog);
}

function readLeftTopButton(data){
	console.log('[SENSOR LEFT TOP]: ' + data);
	if (Math.abs(data - leftSensorTopVal) > 2) {
		leftSensorTopVal = data;
		calculatePosition();
	}
}

function readLeftBottomButton(data){
	//console.log('[SENSOR LEFT BOTTOM]: ' + data);
	if (Math.abs(data - leftSensorBottomVal) > 2) {
		leftSensorBottomVal = data;
		calculatePosition();
	}
}

function readRightTopButton(data){
	//console.log('[SENSOR RIGHT TOP]: ' + data);
	if ( Math.abs(data - rightSensorTopVal) > 2) {
		rightSensorTopVal = data;			
		calculatePosition();
	}
}

function readRightBottomButton(data){
	//console.log('[SENSOR RIGHT BOTTOM]: ' + data);
	if ( Math.abs(data - rightSensorBottomVal) > 2) {
		rightSensorBottomVal = data;			
		calculatePosition();
	}
}

function emitSocket(type, value){
	if (clientIDs.length > 0) {

		board.digitalWrite(dataLed, board.HIGH);

		setTimeout(function(){
			board.digitalWrite(dataLed, board.LOW);
		}, 50);

		switch(type){
			case 'horizontalPosition':
				//io.sockets.emit('horizontalPosition', value);
				gameClient.emit('horizontalPosition', value);
			break;

			case 'jump':
				//io.sockets.emit('jump', value);
				gameClient.emit('jump', value);
			break;
		}
		
	}else{
		//console.log("No sockets emmited, no client connected");
	}
}

function calculatePosition(){

	var leftSensorMax = leftSensorTopMax;
	var rightSensorMax = rightSensorTopMax;

	var leftSensorVal = Math.max(leftSensorTopVal, leftSensorBottomVal);
	var rightSensorVal = Math.max(rightSensorTopVal, rightSensorBottomVal);

	var leftSensorMin = Math.min(leftSensorTopMin, leftSensorBottomMin);
	var rightSensorMin = Math.min(rightSensorTopMin, rightSensorBottomMin);

	var leftPerc = Math.round(((leftSensorVal - leftSensorMin) / (leftSensorMax - leftSensorMin))*100);
	if (leftPerc<0) leftPerc = 0;
	else if (leftPerc > 100) leftPerc = 100;

	leftJumpLog.push(leftPerc);

	var rightPerc = Math.round(((rightSensorVal - rightSensorMin) / (rightSensorMax - rightSensorMin))*100);
	if (rightPerc<0) rightPerc = 0;
	else if (rightPerc > 100) rightPerc = 100;

	rightJumpLog.push(rightPerc);

	var differce = leftPerc - rightPerc;
	var avgPerc = Math.round((leftPerc + rightPerc)/2);
	var factor = -1;

	if (differce<0) factor = 1;

	var horizontalPosition = 50 + ((avgPerc - Math.min(leftPerc, rightPerc)))* factor;

	var visualPosition = '';

	for (var i = 0; i < 19; i++) {
		if(horizontalPosition >= i*(100/19) && horizontalPosition <= (i+1)*(100/19)){
			visualPosition += '↑';
		}else{
			visualPosition += '_';
		}
	};

	emitSocket('horizontalPosition', horizontalPosition);

}
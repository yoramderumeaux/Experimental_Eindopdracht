var socketGlobal;

// Express - start server and init socket.io
// surf naar localhost:1337

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public/src'));
app.get('/', function(req, res){
	res.sendfile(__dirname + '/public/src/index.html'); 
});

var server = require('http').createServer(app); 
var io = io = require('socket.io').listen(server); 
io.set('log level', 1); // reduce logging
server.listen(1337);

io.sockets.on('connection', function(socket){ 
	console.log('client connected');
	socketGlobal = socket;
});

// Require the firmata depenency
var firmata = require('firmata');
var path = '/dev/tty.usbmodemfa131';

//program variables
var leftSensorPin =  3;
var rightSensorPin = 4;
var dataLed = 3;
var activeLed = 2;

var leftSensorMin = 0;
var leftSensorMax = 1023; //max 1023
var leftSensorVal = 0;

var rightSensorMin = 0;
var rightSensorMax = 1023; //max 1023
var rightSensorVal = 0;

var leftJumpLog = [];
var rightJumpLog = [];
var jumpThreshold = 30;
var jumpIntervalTime = 1000; //ms

var board = new firmata.Board(path, function(err){
	if(err){ 
		console.log(err); 	
		return;
	}
	console.log('connected'); 

	board.pinMode(leftSensorPin, board.MODES.INPUT);
	board.pinMode(rightSensorPin, board.MODES.INPUT);
	board.pinMode(5, board.MODES.OUTPUT);
	board.pinMode(6, board.MODES.OUTPUT);

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

	board.analogRead(leftSensorPin, readLeftButton);
	board.analogRead(rightSensorPin, readRightButton);
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

function readLeftButton(data){
	if (Math.abs(data - leftSensorVal) > 2) {
		leftSensorVal = data;
		calculatePosition();
	}
}

function readRightButton(data){
	if ( Math.abs(data - rightSensorVal) > 2) {
		rightSensorVal = data;			
		calculatePosition();
	}
}

function emitSocket(type, value){
	if (socketGlobal) {

		board.digitalWrite(dataLed, board.HIGH);

		setTimeout(function(){
			board.digitalWrite(dataLed, board.LOW);
		}, 50);


		switch(type){
			case 'horizontalPosition':
				socketGlobal.emit('horizontalPosition', value);
			break;

			case 'jump':
				socketGlobal.emit('jump', value);
			break;
		}
		
	}else{
		console.log("Cound't emit socket, no client connected");
	}
}

function calculatePosition(){
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
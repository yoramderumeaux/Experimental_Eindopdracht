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

	socket.on('askForWeight', sendWeight);
	socket.on('setBoardColor', setBoardColor);

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

var redLedPin = 13;
var greenLedPin = 12;
var blueLedPin = 11;

var dataLed = 3;
var activeLed = 2;

var leftSensorTopMin = 740;
var leftSensorTopMax = 100;
var leftSensorTopVal = 0;
var leftSensorBottomMin = 562;
var leftSensorBottomMax = 100; //max 1023
var leftSensorBottomVal = 0;

var rightSensorTopMin = 750;
var rightSensorTopMax = 100; //max 1023
var rightSensorTopVal = 0;
var rightSensorBottomMin = 748;
var rightSensorBottomMax = 100; //max 1023
var rightSensorBottomVal = 0;

var leftJumpLog = [];
var rightJumpLog = [];
var jumpThreshold = 80;
var jumpIntervalTime = 1000; //ms

var horizontalPosition = 50;
var emitIntervalTime = 1000/15;

var leftTopSensorSetup = true;
var leftBottomSensorSetup = true;
var rightTopSensorSetup = true;
var rightBottomSensorSetup = true;
var completedSetup = false;

var weights = [];
var averageWeight = 50;

var partyMode = false;

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

	board.pinMode(redLedPin, board.MODES.OUTPUT);
	board.pinMode(greenLedPin, board.MODES.OUTPUT);
	board.pinMode(blueLedPin, board.MODES.OUTPUT);

	setInterval(function(){
		board.digitalWrite(activeLed, board.HIGH);
		setTimeout(function(){
			board.digitalWrite(activeLed, board.LOW);
		}, 20);
	}, 1000);

	setInterval(checkForJump, jumpIntervalTime);
	setInterval(emitPosition, emitIntervalTime);
	setInterval(calculateWeight, 100);

	board.analogRead(leftSensorTopPin, readLeftTopButton);
	board.analogRead(leftSensorBottomPin, readLeftBottomButton);
	board.analogRead(rightSensorTopPin, readRightTopButton);
	board.analogRead(rightSensorBottomPin, readRightBottomButton);
});

function checkForJump(){

	//wait for more than 30 registered values
	//if (Math.min(leftJumpLog.length, rightJumpLog.length) > 30) {

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

		var minVal = 30; //als hij geen jump detecteerd --> verhogen
		if (maxLeft - minLeft > jumpThreshold && maxRight - minRight > jumpThreshold && minLeft < minVal && minRight < minVal) {		
			console.log('jump detected');
			emitSocket('jump', true);	
		};
	//}

	//empty jump log
	leftJumpLog = [];
	rightJumpLog = [];

	//console.log(rightJumpLog);
}

function readLeftTopButton(data){
	//console.log('[SENSOR LEFT TOP]: ' + data);

	if (leftTopSensorSetup) {
		leftTopSensorSetup = false;
		leftSensorTopMin = data;
	}

	if (Math.abs(data - leftSensorTopVal) > 2) {
		leftSensorTopVal = data;
		calculatePosition();
	}
}

function readLeftBottomButton(data){
	//console.log('[SENSOR LEFT BOTTOM]: ' + data);
	if (leftBottomSensorSetup) {
		leftBottomSensorSetup = false;
		leftSensorBottomMin = data;
	}

	if (Math.abs(data - leftSensorBottomVal) > 2) {
		leftSensorBottomVal = data;
		calculatePosition();
	}
}

function readRightTopButton(data){
	//console.log('[SENSOR RIGHT TOP]: ' + data);
	if (rightTopSensorSetup) {
		rightTopSensorSetup = false;
		rightSensorTopMin = data;
	}

	if ( Math.abs(data - rightSensorTopVal) > 2) {
		rightSensorTopVal = data;			
		calculatePosition();
	}
}

function readRightBottomButton(data){
	//console.log('[SENSOR RIGHT BOTTOM]: ' + data);
	if (rightBottomSensorSetup) {
		rightBottomSensorSetup = false;
		rightSensorBottomMin = data;
	}

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

			case 'weight':
				gameClient.emit('weight', value);
			break;
		}
		
	}else{
		//console.log("No sockets emmited, no client connected");
	}
}

function calculatePosition(){

	if (!completedSetup && !rightTopSensorSetup && !rightBottomSensorSetup && !leftTopSensorSetup && !leftBottomSensorSetup) {
		completedSetup = true;
		console.log(rightSensorTopMin, rightSensorBottomMin, leftSensorTopMin, leftSensorBottomMin);
	}

	var leftSensorMax = leftSensorTopMax;
	var rightSensorMax = rightSensorTopMax;

	var leftSensorVal = leftSensorTopVal + leftSensorBottomVal;
	var rightSensorVal = rightSensorTopVal + rightSensorBottomVal;

	var leftSensorMin = leftSensorTopMin + leftSensorBottomMin;
	var rightSensorMin = rightSensorTopMin +rightSensorBottomMin;

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

	horizontalPosition = 50 + ((avgPerc - Math.min(leftPerc, rightPerc)))* factor;

	var visualPosition = '';

	for (var i = 0; i < 19; i++) {
		if(horizontalPosition >= i*(100/19) && horizontalPosition <= (i+1)*(100/19)){
			visualPosition += '↑';
		}else{
			visualPosition += '_';
		}
	};
}

function calculateWeight(){
	var totalSensor = leftSensorTopVal + leftSensorBottomVal + rightSensorTopVal + rightSensorBottomVal;
	var weight = 150 - Math.round(totalSensor / 1300 * 70);
	weight = Math.max(20, weight);
	weights.push(weight);

	if (weights.length > 8) {
		weights.shift();
	}

	var averageWeightBuffer = 0;
	for (var i = 0; i < weights.length; i++) {
		averageWeightBuffer += weights[i];	
	}

	averageWeight = Math.round(averageWeightBuffer/ weights.length);
	//console.log(averageWeight);
}

function setBoardColor(color){
	console.log('hello ' + color);
	var redBool = false;
	var greenBool = false;
	var blueBool = false;

	switch(color){
		case 'red':
			redBool = true;
			greenBool = false;
			blueBool = false;
		break;

		case 'yellow':
			redBool = true;
			greenBool = true;
			blueBool = false;
		break;

		case 'green':
			redBool = false;
			greenBool = true;
			blueBool = false;
		break;

		case 'blue':
			redBool = false;
			greenBool = false;
			blueBool = true;
		break;

		case 'purple':
			redBool = true;
			greenBool = false;
			blueBool = true;
		break;

		case 'white':
			redBool = true;
			greenBool = true;
			blueBool = true;
		break;

		case 'party':
			redBool = false;
			greenBool = false;
			blueBool = false;

			partyMode = true;
		break;
	}

	if (!redBool && !greenBool && !blueBool) {
		console.log('partyMode');
	}else{
		if(redBool){
			board.digitalWrite(redLedPin, board.HIGH);
		}else{
			board.digitalWrite(redLedPin, board.LOW);
		}

		if(greenBool){
			board.digitalWrite(greenLedPin, board.HIGH);
		}else{
			board.digitalWrite(greenLedPin, board.LOW);
		}

		if(blueBool){
			board.digitalWrite(blueLedPin, board.HIGH);
		}else{
			board.digitalWrite(blueLedPin, board.LOW);
		}
	}
}

function sendWeight(){
	if (completedSetup) {
		emitSocket('weight', averageWeight);
	}else{
		return false;
	}
}

function emitPosition(){
	emitSocket('horizontalPosition', horizontalPosition);
}
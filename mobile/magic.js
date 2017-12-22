console.log("Magic.js loaded...");

var peer = new Peer('mobile', {key: 'q4d8i5lez7rdx6r'});

peer.on('error', function(error) {
	console.log(error)
});


var conn = peer.connect('desktop');
conn.on('open', function() {
	console.log("Connection Established");
});

var handleMotion = function(e) {
	var data = {
		acceleration: e.acceleration,
		accelerationIncludingGravity: e.accelerationIncludingGravity,
		interval: e.interval,
		rotationRate: e.rotationRate,
		timestamp: new Date().getTime()
	};
	conn.send(JSON.stringify(data));
};

var toggleStream = function() {
	if(window.ondevicemotion) {
		window.ondevicemotion = null;
		conn.send("END MOTION")
		document.getElementById("toggleButton").innerHTML = "Start";
		document.getElementById("toggleButton").disabled = false;
	} else {
		window.ondevicemotion = handleMotion;
		document.getElementById("toggleButton").innerHTML = "Recording";
		document.getElementById("toggleButton").disabled = true;
		setTimeout(toggleStream, 2500);
	}
};

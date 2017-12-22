var gestRec = {
	version: 0.1,

	//The maximum dutation of a motion - measured in milliseconds
	motionTimeout: 250,

	//The minimum time between gestures recognized - measured in milliseconds
	eventTimeout: 500,

	//Timestamp of the last time an event was triggered
	//This is used to prevent multiple events being fired within `timeout`ms of each other
	lastTrigger: 0,

	//Raw differential threshold(s) that will have to be crossed for an event to be triggered
	//The quantity listed requires that the absolute value of a series of motion events be 
	//greater than or equal to the threshold for it to trigger the corresponding gesture
	threshold: 	{
		alpha: 10,
		beta: 10,
		gamma: 10
	},

	//The min/max of each variable along with a timestamp as to when they were last set which is
	//used in calculating gesture recognition
	localExtremes: {
		alpha: {min: 0, max: 0, timeStamp: 0},
		beta: {min: 0, max: 0, timeStamp: 0},
		gamma: {min: 0, max: 0, timeStamp: 0},
	},

	//List of variables to check when processMotion is called along with the names of their callbacks
	rotationVariables: [
		{name: "alpha", callback: "flip"},
		{name: "beta", callback: "twist"},
		{name: "gamma", callback: "flick"}
	],

	callback: null,

	//Initialize gestRec.js on the window, saving the old callback so that the event can be passed on
	init: function() {
		if(window.ondevicemotion)
			this.callback = window.ondevicemotion;

		window.ondevicemotion = this._processMotion.bind(this);
	},


	//Do the number crunching required to determine if a given motion was detected and then
	//fire that function accordingly
	_processMotion: function(e) {

		//Event is inside our eventTimeout, and is skipped accordingly
		if(e.timeStamp < this.lastTrigger + this.eventTimeout) 
			return this.callback != null ? this.callback() : null; 

		//Process each rotation variable to detect variation between most recently detected min/max
		this.rotationVariables.forEach(function(elem) {
			var n = elem.name;
			var measure = e.rotationRate[n];
			if(measure > this.localExtremes[n].max || measure < this.localExtremes[n].min) {
				//If timestamp <= lastTime + motionTimeout, then that means we are setting a new min/max, and we should reset the timestamp
				if(e.timeStamp <= this.localExtremes[n].timeStamp + this.motionTimeout) {
					
					this.localExtremes[n].min = this.localExtremes[n].min < measure ? this.localExtremes[n].min : measure;
					this.localExtremes[n].max = this.localExtremes[n].max > measure ? this.localExtremes[n].max : measure;
					this.localExtremes[n].timeStamp = e.timeStamp;

				} else { //If timestamp > lastTime + motionTimeout, zero out, then assign new value and continue out of if statement

					this.localExtremes[n] = {min: 0, max: 0, timeStamp: e.timeStamp};
					this.localExtremes[n].min = this.localExtremes[n].min < measure ? this.localExtremes[n].min : measure;
					this.localExtremes[n].max = this.localExtremes[n].max > measure ? this.localExtremes[n].max : measure;
					return;//Return here or should it trigger if we just reset and they pass the threshold?
				}

				//If Math.abs(localExtreme min - max) > threshold, event recognized
				if(Math.abs(this.localExtremes[n].min - this.localExtremes[n].max) >= this.threshold[n]) {
					this.lastTrigger = e.timeStamp;
					return this[elem.callback]("SPEED");
				}
			}

		}, this); //Necessary to ensure we call callbacks on gestRec.js object and not window

		return this.callback != null ? this.callback() : null;
	},

	set: function(gesture, callback) {
		this[gesture] = callback;
	},

	//Gamma
	flick: function(speed) {
		console.log("Flick", speed);
	},

	//Alpha
	flip: function(speed) {
		console.log("Flip", speed);
	},

	//Beta
	twist: function(speed) {
		console.log("Twist", speed);
	}
}

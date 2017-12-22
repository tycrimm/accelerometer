console.log("Magic.js loaded...");

window.ondevicemotion = function(e) {
	console.log(e);
	window.ondevicemotion = null;
};

//BEGIN graphing 
var data = [],
	graphs = {},
	graphVariables = ['x','y','z'],
	interval = 50; //Remember to resest this after getting data back from mobile

var margin = {top: 20.5, right: 30, bottom: 30, left: 40.5},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    yDomain = 15;

//Wait until D3 is loaded before trying to use it
window.onload = function(){
	setupGraphs();
};

var setupGraphs = function() {

	//Initialize scales and axis
	graphs.xS = d3.scale.linear()
		.domain([0, 50])
		.range([0, width]);

	graphs.yS = d3.scale.linear()
		.domain([-yDomain, yDomain])
		.range([height, 0]);

	graphs.xAxis = d3.svg.axis()
		.scale(graphs.xS)
		.orient('middle')
		.ticks(5)
		.tickFormat(function(d) { return (d * interval) + "ms"});

	graphs.yAxis = d3.svg.axis()
		.scale(graphs.yS)
		.orient('left')
		.ticks(10);

	//Add each graph to DOM
	for(var i = 0; i < graphVariables.length; i++) {
		var v = graphVariables[i];

		graphs[v] = d3.select('body').append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
			.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		graphs[v].append('text')
			.attr('x', width / 2)
			.attr('y', 0 - margin.top / 2)
			.attr('text-anchor', 'middle')
			.text(v);

		graphs[v].append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(graphs.xAxis)
			
		graphs[v].append('line')
			.attr('class', 'midline')
			.attr('x1', 0)
			.attr('x2', width)
			.attr('y1', height / 2)
			.attr('y2', height / 2);


		graphs[v].append('g')
			.attr('class', 'y axis')
			.call(graphs.yAxis);
	}
}

var refreshGraphs = function() {

	for(var i = 0; i < graphVariables.length; i++) {
		var v = graphVariables[i];

		var line = d3.svg.line()
			.x(function(d, i) { return graphs.xS(i); })
			.y(function(d) { return graphs.yS(d.acceleration[v]); })
			.interpolate(['cardinal']);

		graphs[v].selectAll('path.' + v).remove();

		graphs[v].append('path')
			.attr('d', line(data))
			.attr('class', v);
	}
}


var handleMotion = function(e) {
	var d = {
		acceleration: e.acceleration,
		accelerationIncludingGravity: e.accelerationIncludingGravity,
		interval: e.interval,
		rotationRate: e.rotationRate,
		timestamp: new Date().getTime()
	};
	data.push(d);
};

var toggleStream = function() {
	if(window.ondevicemotion) {
		window.ondevicemotion = null;
		refreshGraphs();
		data = [];
		document.getElementById("toggleButton").innerHTML = "Start";
		document.getElementById("toggleButton").disabled = false;
	} else {
		window.ondevicemotion = handleMotion;
		document.getElementById("toggleButton").innerHTML = "Recording";
		document.getElementById("toggleButton").disabled = true;
		setTimeout(toggleStream, 2500);
	}
};

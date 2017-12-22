//WebRTC Connection between mobile device and desktop
var peer = new Peer('desktop', {key: 'q4d8i5lez7rdx6r'});

//Wait for connection from mobile
peer.on('connection', function(conn) {
	console.log("Connection Established");
	conn.on('data', function(e) {
		if(e == "END MOTION") {
			refreshGraphs();
			data = [];
		}
		else
			data.push(JSON.parse(e));
	});
});

peer.on('error', function(error) {
	console.log(error)
})
//END WebRTC

//BEGIN graphing 
var data = [],
	graphs = {},
	graphVariables = ['alpha','beta','gamma'],
	interval = 50; //Remember to resest this after getting data back from mobile

var margin = {top: 20.5, right: 30, bottom: 30, left: 40.5},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//Wait until D3 is loaded before trying to use it
window.onload = function(){
	setupGraphs();
};

var setupGraphs = function() {

	//Initialize scales and axis
	graphs.x = d3.scale.linear()
		.domain([0, 50])
		.range([0, width]);

	graphs.y = d3.scale.linear()
		.domain([-15, 15])
		.range([height, 0]);

	graphs.xAxis = d3.svg.axis()
		.scale(graphs.x)
		.orient('middle')
		.ticks(5)
		.tickFormat(function(d) { return (d * interval) + "ms"});

	graphs.yAxis = d3.svg.axis()
		.scale(graphs.y)
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

	//See if this smooths things out...
	// for(var i = data.length - 1; i > 0; i--) {
	// 	if(i % 2 != 0)
	// 		data.splice(i, 1);
	// }	

	for(var i = 0; i < graphVariables.length; i++) {
		var v = graphVariables[i];

		var line = d3.svg.line()
			.x(function(d, i) { return graphs.x(i); })
			.y(function(d) { return graphs.y(d.rotationRate[v]); })
			.interpolate(['cardinal']);

		graphs[v].selectAll('path.' + v).remove();

		graphs[v].append('path')
			.attr('d', line(data))
			.attr('class', v);
	}

	// var circles = svg.selectAll('circle')
	// 	.data(alpha)
	// 	.enter()
	// 	.append('circle');

	// var circleAttributes = circles
	// 						.attr('cx', function(d) {return d[1] * 5})
	// 						.attr('cy', function(d) {return y(d[0])})
	// 						.attr('r', '5');
}

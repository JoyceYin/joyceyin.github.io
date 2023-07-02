
let zipcodeURL = 'https://data.beta.nyc/dataset/3bf5fb73-edb5-4b05-bb29-7c95f4a727fc/resource/894e9162-871c-4552-a09c-c6915d8783fb/download/zip_code_040114.geojson'
let stationURL = 'https://data.cityofnewyork.us/api/geospatial/arq3-7z49?method=export&format=GeoJSON'
let stationNameURL = 'https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/projects/js-basics/data/StructSta.json'

let crowdDataURL = 'https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/projects/js-basics/data/CrowdData.json'
// let noiseData
var overviewData = [{"crowd":15,"noise":-10},
					{"crowd":10,"noise":-30},
					{"crowd":25,"noise":-25},
					{"crowd":20,"noise":-35}]


// only analyze the subway station with structure images 
// combine station locations with the same structure (connected stations)
function filterStation(data, subwaydata) {
	let selectedSbwy = [];
	var idx = 0;
	for (i=0; i<data.length;i++) {
		var idList = data[i]['id']
		let name = data[i]['Station']
		let line = data[i]['Line']
		let url = data[i]['URL']
		let notes = ''
		let coord0 = 0
		let coord1 = 0
		for (j=0; j<subwaydata.length; j++) {
			if (idList.includes(subwaydata[j].properties.objectid)){
				notes = notes+' '+subwaydata[j].properties.notes
				coord0 += subwaydata[j].geometry.coordinates[0]
				coord1 += subwaydata[j].geometry.coordinates[1]
			}
		}
		coord0 = coord0/idList.length
		coord1 = coord1/idList.length
		var NewJson = {"type":"Feature",
						"properties": {"name":name, "line":line,"url":url,"notes":notes,"idobjects":idList},
						"geometry": {"type":"Point","coordinates":[coord0,coord1]}}
		selectedSbwy[idx] = NewJson
		idx++
	}
	return selectedSbwy;
}
// draw map
function drawMap(selectedData, zipdata, width, height, container) {
	var projection = d3.geoMercator()
			.fitSize([width,height], {type:'FeatureCollection',features:selectedData});
	var path = d3.geoPath().projection(projection);
	let canvas = container.append("svg")
		.attr('width', width).attr('height',height)

	canvas.append('g').selectAll('path')
				.data(zipdata.features)
				.enter()
				.append('path')
				.style("fill", "white")
				.style("stroke-width", "1")
				.style("stroke", "black")
				.style("opacity", .7)
				.attr('d', path)
	return [canvas, projection]
}
// customize circle
function drawCircleInMap(container, canvas, selectedData, projection,crowdData){
	// Tooltip
	var Tooltip = container
		.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0)
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "2px")
		.style("border-radius", "5px")
		.style("padding", "2px")

	// Three function that change the tooltip when user hover / move / leave a cell
	var mouseover = function(d) {
	  Tooltip.style("opacity", 1)
	}
	var mousemove = function(d) {
		// console.log(d['properties'])
		Tooltip
			.html(d['properties'].name + "<br>" + d['properties'].line)
			.style("left", (d3.mouse(this)[0]+10) + "px")
			.style("top", (d3.mouse(this)[1]) + "px")
	}
	var mouseleave = function(d) {
		Tooltip.style("opacity", 0)
	}

	canvas.selectAll('circle')
			.data(selectedData)
			.enter().append('circle')
			.attr('class','stationPt')
			.attr('r',8)
			.style("fill", "69b3a2")
			.attr("stroke", "#69b3a2")
			.attr("stroke-width", 3)
			.attr("fill-opacity", .4)
			.attr('cx',function(d) { return projection(d.geometry.coordinates)[0]})
			.attr('cy',function(d) { return projection(d.geometry.coordinates)[1]})
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)
			.on("click", function(d){
				console.log('click',d.properties.url)
				d3.select("#scatter").remove()
				d3.select("#picTitle").html(d['properties'].name)
				d3.select("#picShow")
				.attr("src", d.properties.url)
				.attr("width", 400)
				.attr("height", 400);

				d3.select('#selectButton').remove()
				d3.select('#StationLineTS').remove()
				d3.select('#EachLineChart').html('<select id="selectButton"></select><div id="StationLineTS"></div>')
				drawLineChart(d.properties.name, crowdData);
			})
}
// For transposing array in timeseries
function transposeArr(A) {
	const result = [];
	for (let i=0; i<A[0].length;i++){
		const col=[];
		for (let j=0; j<A.length;j++){
			col.push(A[j][i]);
		}
		result.push(col);
	}
	return result
}
// draw line chart for noise and crowd for each line in station
function drawLineChart(input, crowdData){
	let GroupLineData = [];
	let LineName = [];
	var idx = 0;
	for (i=0; i<crowdData.length;i++) {
		if (crowdData[i]['properties'].Station === input) {
			GroupLineData[idx] = crowdData[i]['timeseries']
			LineName[idx] = crowdData[i]['properties'].Line;
			idx++;
		}
	}
	// set the dimensions and margins of the graph
	var margin = {top: 10, right: 100, bottom: 30, left: 30},
		w1 = 460 - margin.left - margin.right,
		h1 = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
	var svg = d3.select("#StationLineTS").append("svg")
		.attr("width", w1 + margin.left + margin.right)
		.attr("height", h1 + margin.top + margin.bottom)
		.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the options to the button
	d3.select("#selectButton")
		.selectAll('myOptions').data(LineName)
		.enter().append('option')
		.text(function (d) { return d; }) // text showed in the menu
		.attr("value", function (d) { return d; }) // corresponding value returned by the button

	// A color scale: one color for each group
	var myColor = d3.scaleOrdinal()
		.domain(LineName)
		.range(d3.schemeSet2);

// Add X axis --> it is a date format
	var x = d3.scaleLinear().domain([0,20])
				.range([ 0, w1 ]);
	svg.append("g")
		.attr("transform", "translate(0," + h1 + ")")
		.call(d3.axisBottom(x));

	// Add Y axis
	var y = d3.scaleLinear().domain( [0,11]).range([ h1, 0 ]);
	svg.append("g").call(d3.axisLeft(y));

	let initialData = GroupLineData[0]
	// Initialize line with group a
	var line = svg.append('g').append("path")
			.datum(initialData).attr("d", d3.line()
				.x(function(d) { return x(+d[0]) })
				.y(function(d) { return y(+d[1]) })
			)
	.attr("stroke", function(d){ return myColor(LineName[0]) })
	.style("stroke-width", 4)
	.style("fill", "none")

	// A function that update the chart
	function updateLineChart(selectedGroup) {

		// Create new data with the selection?
		var StationIdx = LineName.indexOf(selectedGroup)
		const dataFilter = GroupLineData[StationIdx]

		// Give these new data to update line
		line.datum(dataFilter).transition()
		.duration(1000).attr("d", d3.line()
		.x(function(d) { return x(+d[0]) })
		.y(function(d) { return y(+d[1]) })
		)
		.attr("stroke", function(d){ return myColor(selectedGroup) })
	}

	// When the button is changed, run the updateChart function
	d3.select("#selectButton").on("change", function(event,d) {
		// recover the option that has been chosen
		const selectedOpt = d3.select(this).property("value")
		// run the updateChart function with this selected option
		console.log(selectedOpt)
		updateLineChart(selectedOpt)
	})
}


d3.json(zipcodeURL).then((data) =>{
	let zipdata = data;

	d3.json(stationURL).then((data,error) => {
		if (error) {
			console.log(log)
		}else{
			let subwayData = data.features;

			d3.json(stationNameURL).then((data) => {
				let stationName = data['Structure']
				let selectedSbwy = filterStation(stationName, subwayData)

				d3.json(crowdDataURL).then((data) => {
					let crowdData = data;

					const width = 800;
					const height = 700;
					var svgContainer = d3.select('#canvas');

					// Map
					let mapData = drawMap(selectedSbwy, zipdata, width, height, svgContainer);
					canvas = mapData[0];
					projection = mapData[1];
					drawCircleInMap(svgContainer, canvas, selectedSbwy, projection,crowdData);

					// Scatter Plot for noise level and crowd
					// var margin = {top: 10, right: 30, bottom: 30, left: 60},
					// width = 460 - margin.left - margin.right,
					// height = 400 - margin.top - margin.bottom;
					var spacing = 120

					var ScatterContain = d3.select("#scatter")
						.attr("width", 400)
						.attr("height", 400)
						.style("background","pink")
						.append("g")
						.attr("transform","translate(" + spacing/2 + "," + spacing/2 + ")");

					  // Add X axis
					var xScale = d3.scaleLinear()
						.domain([d3.min(overviewData, function(d){return d.crowd;})-1,
							d3.max(overviewData, function(d){return d.crowd})+1])
						.range([ 0, 400-spacing ]);

					// Add Y axis
					var yScale = d3.scaleLinear()
					.domain([d3.min(overviewData, function(d){return d.noise}),
						d3.max(overviewData, function(d){return d.noise})])
					.range([ 400-spacing, 0]);

					var xAxis = d3.axisBottom(xScale);
					var yAxis = d3.axisLeft(yScale);

					ScatterContain.append("g")
						.attr("transform","translate(0,"+ (400-spacing) +")")
						.call(xAxis);
					ScatterContain.append("g").call(yAxis);

					  // // Add dots
					ScatterContain.append('g').selectAll("dot")
						.data(overviewData).enter().append("circle")
						.attr("cx", function (d) { return xScale(d.crowd); } )
						.attr("cy", function (d) { return yScale(d.noise); } )
						.attr("r", 5)
						.style("fill", "#69b3a2")
				})

			})
		}
		})
	})
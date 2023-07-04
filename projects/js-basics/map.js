
let zipcodeURL = 'https://data.beta.nyc/dataset/3bf5fb73-edb5-4b05-bb29-7c95f4a727fc/resource/894e9162-871c-4552-a09c-c6915d8783fb/download/zip_code_040114.geojson'
let stationURL = 'https://data.cityofnewyork.us/api/geospatial/arq3-7z49?method=export&format=GeoJSON'
let stationNameURL = 'https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/projects/js-basics/data/StructSta.json'

let crowdDataURL = 'https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/projects/js-basics/data/CrowdData.json'
let noiseDataURL = 'https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/projects/js-basics/data/NoiseData.json'

let overviewDataURL = 'https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/projects/js-basics/data/StationOverview.json'

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
function drawCircleInMap(container, canvas, selectedData, projection, NoiseCrowdData){
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
		Tooltip.transition().duration(200).style("opacity", 0)
	}

	let maxCount = d3.max(selectedData, function(d){return d.value['count_people'];})
	let minCount = d3.min(selectedData, function(d){return d.value['count_people'];})
	let maxMaxInten = d3.max(selectedData, function(d){return d.value['max_intensity'];})
	let minMaxInten = d3.min(selectedData, function(d){return d.value['max_intensity'];})

	// color refer: https://github.com/d3/d3-scale-chromatic

	canvas.selectAll('circle')
			.data(selectedData)
			.enter().append('circle')
			.attr('class','stationPt')
			.attr('r', function(d){
				ratio = (d.value['count_people']-minCount)/(maxCount-minCount);
				if (isNaN(ratio)){ratio=0;};
				console.log(ratio);
				return 5+(15-5)*ratio;
			})
			.style("fill", function(d){ 
				return d3.interpolateReds((d.value['max_intensity']-minMaxInten)/(maxMaxInten-minMaxInten)); })
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
				d3.select('a.imageurl').attr("href",d.properties.url)
				d3.select("#picShow")
				.attr("src", d.properties.url)
				.attr("width", 400)
				.attr("height", 400);

				d3.select('#selectButton').remove()
				d3.select('#StationLineTS').remove()
				d3.select('#EachLineChart').html('<select id="selectButton"></select><div id="StationLineTS"></div>')
				drawLineChart(d.properties.name, NoiseCrowdData);
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
function drawLineChart(input, NoiseCrowdData){
	let GroupCrowdData = [];
	let GroupNoiseData = []
	let LineName = [];
	var idx = 0;
	for (i=0; i<NoiseCrowdData.length;i++) {
		if (NoiseCrowdData[i].Station === input) {
			GroupCrowdData[idx] = NoiseCrowdData[i].CrowdTS
			GroupNoiseData[idx] = NoiseCrowdData[i].NoiseTS
			LineName[idx] = NoiseCrowdData[i].Line;
			idx++;
		}
	}
	// set the dimensions and margins of the graph
	var margin = {top: 10, right: 65, bottom: 30, left: 40},
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
	// var myColor = d3.scaleOrdinal().domain(LineName).range(d3.schemeSet2);
	let crowdColor = d3.schemeSet2[0]
	let noiseColor = d3.schemeSet2[1]

	// Handmade legend
	svg.append("circle").attr("cx",w1-60).attr("cy",10).attr("r", 6).style("fill", crowdColor)
	svg.append("circle").attr("cx",w1-60).attr("cy",10+30).attr("r", 6).style("fill", noiseColor)
	svg.append("text").attr("x", w1-60+10).attr("y", 10).text("People").style("font-size", "15px").attr("alignment-baseline","middle")
	svg.append("text").attr("x", w1-60+10).attr("y", 10+30).text("Noise").style("font-size", "15px").attr("alignment-baseline","middle")


	// Add Y and X axis and set domain based on min and max
	let minY = Math.round(Math.min(...transposeArr(GroupNoiseData[0])[1]))-1
	let maxY = Math.max(...transposeArr(GroupCrowdData[0])[1])+1
	let Xrange = Math.max(...transposeArr(GroupNoiseData[0])[0])
	// let transX = Math.round((maxY/(maxY-minY))*h1)
	let transX = h1-30

	// Add X axis --> it is a date format
	var x = d3.scaleLinear().domain([0,Xrange])
				.range([ 0, w1 ]);
	xAxis = svg.append("g")
		.attr("transform", "translate(0," + transX + ")")
		.call(d3.axisBottom(x));

	var y0 = d3.scaleLinear().domain( [0,maxY] ).range([ h1-30, 0 ]);
	y0Axis = svg.append("g").call(d3.axisLeft(y0));

	var y1 = d3.scaleLinear().domain( [minY,0] ).range([ h1-30, 0 ]);
	y1Axis = svg.append("g").attr("transform", "translate(" + w1 + ",0)").call(d3.axisRight(y1));

	// Add X axis label:
	svg.append("text")
		.attr("x", w1/2).attr("y", h1 + margin.top-6)
		.style("font-size", 12)
		.style("text-anchor", "middle").text("TimeStamp (s)");

	// Y axis label:
	svg.append("text").attr("text-anchor", "end")
		.attr("transform", "rotate(-90)").style("font-size", 12)
		.attr("y", -margin.left+10).attr("x", -margin.top)
		.text("People Counting")

	svg.append("text").attr("text-anchor", "end")
		.attr("transform", "rotate(90)").style("font-size", 12)
		.attr("y", -w1-margin.left+5).attr("x", -margin.top+150)
		.text("Max Noise Intensity (dB)")

	// let initialData = GroupLineData[0]
	// Initialize line with crowd line chart
	var line0 = svg.append('g').append("path")
			.datum(GroupCrowdData[0]).attr("d", d3.line()
				.x(function(d) { return x(+d[0]) })
				.y(function(d) { return y0(+d[1]) })
			)
	.attr("stroke", function(d){ return crowdColor })
	.style("stroke-width", 4)
	.style("fill", "none").style("opacity", 0.5)

	// Initialize line with noise line chart
	var line1 = svg.append('g').append("path")
			.datum(GroupNoiseData[0]).attr("d", d3.line()
				.x(function(d) { return x(+d[0]) })
				.y(function(d) { return y1(+d[1]) })
			)
	.attr("stroke", function(d){ return noiseColor })
	.style("stroke-width", 4)
	.style("fill", "none").style("opacity", 0.5)

	// A function that update the chart
	function updateLineChart(selectedGroup) {

		// Create new data with the selection?
		var StationIdx = LineName.indexOf(selectedGroup)
		const crowdFilter = GroupCrowdData[StationIdx]
		const noiseFilter = GroupNoiseData[StationIdx]

		let minY = Math.round(Math.min(...transposeArr(noiseFilter)[1]))-1
		let maxY = Math.max(...transposeArr(crowdFilter)[1])+1
		let Xrange = Math.max(...transposeArr(crowdFilter)[0])
		let transX = Math.round((maxY/(maxY-minY))*h1)

		x.domain([0,Xrange])
		xAxis.transition().duration(1000).call(d3.axisBottom(x))
		y0.domain([0,maxY])
		y0Axis.transition().duration(1000).call(d3.axisLeft(y0))
		y1.domain([minY,0])
		y1Axis.transition().duration(1000).call(d3.axisRight(y1))

		// Give these new data to update line
		line0.datum(crowdFilter).transition().duration(1000).attr("d", d3.line()
		.x(function(d) { return x(+d[0]) })
		.y(function(d) { return y0(+d[1]) })
		)
		.attr("stroke", function(d){ return crowdColor })

		line1.datum(noiseFilter).transition().duration(1000).attr("d", d3.line()
		.x(function(d) { return x(+d[0]) })
		.y(function(d) { return y1(+d[1]) })
		)
		.attr("stroke", function(d){ return noiseColor })
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
// Scatter Plot for noise level and crowd
function drawOverviewScatter(overviewData){
	var margin = {top: 10, right: 30, bottom: 30, left: 60},
	width = 460 - margin.left - margin.right,
	height = 450 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var ScatterContain = d3.select("#scatter").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform","translate(" + margin.left + "," + margin.top + ")");

	// Add X axis
	var xScale = d3.scaleLinear()
		.domain([d3.min(overviewData, function(d){return d.value[0]['count_people'];})-1,
			d3.max(overviewData, function(d){return d.value[0]['count_people']})+1])
		.range([ 0, width ]);
	ScatterContain.append("g")
		.attr("transform", "translate(0," + 20 + ")")
		.call(d3.axisBottom(xScale));

	// Add Y axis
	var yScale = d3.scaleLinear()
	.domain([d3.min(overviewData, function(d){return d.value[0]['max_intensity']}),
		d3.max(overviewData, function(d){return d.value[0]['max_intensity']})])
	.range([ height, 20]);
	ScatterContain.append("g").call(d3.axisLeft(yScale));

	// Add X axis label:
	ScatterContain.append("text")
		.attr("x", width/2).attr("y", margin.top)
		.style("text-anchor", "middle").text("People Count");

	// Y axis label:
	ScatterContain.append("text").attr("text-anchor", "end")
		.attr("transform", "rotate(-90)")
		.attr("y", -margin.left+20).attr("x", -margin.top)
		.text("Max Noise Intensity (dB)")

	// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
	var tooltip = d3.select("#scatter").append("div")
	.style("opacity", 0).attr("class", "tooltip")
	.style("background-color", "white")
	.style("border", "solid")
	.style("border-width", "1px")
	.style("border-radius", "5px")
	.style("padding", "10px")

	var mouseover = function(d) { tooltip.style("opacity", 1) }
	var mousemove = function(d) {
		console.log(d3.mouse(this)[0])
		tooltip.html(d.station +"<br>Line:" + d.line)
		.style("left", (d3.mouse(this)[0]+950) + "px")
		.style("top", (d3.mouse(this)[1]) + "px")
	}
	var mouseleave = function(d) { tooltip.transition().duration(200).style("opacity", 0) }

	  // // Add dots
	ScatterContain.append('g').selectAll("dot")
		.data(overviewData).enter().append("circle")
		.attr('class','scatterPt')
		.attr("cx", function (d) { return xScale(d.value[0]['count_people']); } )
		.attr("cy", function (d) { return yScale(d.value[0]['max_intensity']); } )
		.attr("r", 7)
		.style("fill", "#69b3a2")
		.style("opacity", 0.3)
		.on("mouseover", mouseover )
		.on("mousemove", mousemove )
		.on("mouseleave", mouseleave )
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

					d3.json(noiseDataURL).then((data) => {
						let noiseData = data;

						d3.json(overviewDataURL).then((data) => {
							let scatterData = data;
							drawOverviewScatter(scatterData);

							// Coombine Data
							let NoiseCrowdData = []
							for (var i=0; i<crowdData.length;i++) {
								for (var j=0; j<noiseData.length;j++) {
									let cdStat = crowdData[i]['properties']
									let nsStat = noiseData[j]['properties']
									if ((cdStat.Station === nsStat.Station) && (cdStat.Line === nsStat.Line)) {
										var newData = {'Station':cdStat.Station, 'Line':cdStat.Line,
														'CrowdTS': crowdData[i]['timeseries'],
														'NoiseTS': noiseData[j]['properties'].Timeseries}
										NoiseCrowdData.push(newData)
									}
								}
							}
							console.log(NoiseCrowdData);

							const width = 800;
							const height = 700;
							var svgContainer = d3.select('#canvas');

							// Map
							// let testData = []
							for (var i=0; i<selectedSbwy.length;i++) {
								var avgValue = {'count_people': 0, 'max_intensity':0,
												'mean_intensity':0,'min_intensity':0};
								let count = 0;
								for (var j=0; j<scatterData.length;j++) {
									if (selectedSbwy[i].properties.name === scatterData[j].station){
										avgValue['count_people'] += scatterData[j].value[0]['count_people']
										avgValue['max_intensity'] += scatterData[j].value[0]['max_intensity']
										avgValue['mean_intensity'] += scatterData[j].value[0]['mean_intensity']
										avgValue['min_intensity'] += scatterData[j].value[0]['min_intensity']
										count++;
									}
								}
								avgValue['count_people'] = Math.round(avgValue['count_people']/count);
								avgValue['max_intensity'] = Math.round(avgValue['max_intensity']/count);
								avgValue['mean_intensity'] = Math.round(avgValue['mean_intensity']/count);
								avgValue['min_intensity'] = Math.round(avgValue['min_intensity']/count);
								selectedSbwy[i]['value'] = avgValue;
							}

							let mapData = drawMap(selectedSbwy, zipdata, width, height, svgContainer);
							canvas = mapData[0];
							projection = mapData[1];
							drawCircleInMap(svgContainer, canvas, selectedSbwy, projection, NoiseCrowdData);
						})
					})
				})

			})
		}
		})
	})
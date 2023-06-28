
let zipcodeURL = 'https://storage.googleapis.com/kagglesdsdata/datasets/355600/698418/nyc-zip-code-tabulation-areas-polygons.geojson?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcp-kaggle-com%40kaggle-161607.iam.gserviceaccount.com%2F20230627%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230627T031222Z&X-Goog-Expires=259200&X-Goog-SignedHeaders=host&X-Goog-Signature=2af59737501ce5d15769648ea19f3527cc260f79d6606b539d4a137723bca4c1986fe9016e2dab711dc88360a2b2ffee6a5559aa08e9e9f84716c208c125a1907fd80822f546093ade27a94ca0a6b0519dd8935b60c4dd0b504c4facb6242267b04ac8070252c669166a90cda2e746c31afd414a9f03356738d60701fd07a76aaf9c0dcd27bc1a80755d85542e30c584ad735eae0e71a3ee0fcd0b9c698033e9d25d4e19736e8ac98c463478e14a87486fca7d1c713aea2d452eae3d4e381644c343793ebb17391d14f033599e847679401ec2b93c81eaf617839e03eee238889b4952918fe0f94b144f38c96adc4ee866cac3b22d9b103b73a806c260e86792'
let stationURL = 'https://data.cityofnewyork.us/api/geospatial/arq3-7z49?method=export&format=GeoJSON'
let stationName = [
	{"Station": "Times Sq - 42nd St", "Line":"N,Q,R,W,S,1,2,3,7"},
	{"Station": "42nd St - Port Authority Bus Term", "Line":"A,C,E"},
	{"Station": "Grand Central - 42nd St", "Line":"S,4,5,6,7"},
	{"Station": "Herald Sq - 34th St", "Line":"B,D,F,M,N,Q,R,W"},
	{"Station": "Union Sq - 14th St", "Line":"L,N,Q,R,W,4,5,6"},
	{"Station": "Fulton St", "Line":"A,C,J,Z,2,3,4,5"},
	{"Station": "59th St - Columbus Circle", "Line":"A,B,C,D,1"},
	{"Station": "Lexington Av/59 St", "Line":"N,R,W,4,5,6"},
	{"Station": "Chambers St Cortlandt", "Line":"R,W,1"},
	{"Station": "Chambers St/WTC/Park Pl", "Line":"A,C,E,2,3"},
	{"Station": "47-50 Sts-Rockefeller Center", "Line":"B,D,F,M"},
	{"Station": "Lexington Ave - 53rd St", "Line":"E,M"},
	{"Station": "51st St", "Line":"6"},
	{"Station": "5th Ave - Bryant Pk", "Line":"B,D,F,M,7"},
	{"Station": "Atlantic Av - Barclay's Center", "Line":"B,D,N,Q,R,2,3,4,5"},
	{"Station": "14 St-6 Av", "Line":"F,M,1,2,3,L"},
	{"Station": "Canal St", "Line":"J,N,Q,R,W,Z,6"},
	{"Station": "14 St-8 Av", "Line":"A,C,E,L"},
	{"Station": "Jay St - MetroTech", "Line":"A,C,F,R"},
	{"Station": "W 4th St - Washington Sq (Lower)", "Line":"A,B,C,D,E,F,M"},
	{"Station": "Broadway - Lafayette St", "Line":"B,D,F,M"},
	{"Station": "Bleecker St", "Line":"6"},
	{"Station": "Court St", "Line":"R"},
	{"Station": "Borough Hall", "Line":"2,3,4,5"},
	{"Station": "Delancey St - Essex St", "Line":"F,J,M,Z"},
	{"Station": "Brooklyn Bridge - City Hall", "Line":"4,5,6"},
	{"Station": "Chambers St", "Line":"J,Z"},
	{"Station": "23rd St", "Line":"6"},
	{"Station": "DeKalb Ave", "Line":"B,Q,R"},
	{"Station": "5th Ave - 53rd St", "Line":"E,M"},
	{"Station": "34th St - Hudson Yards", "Line":"B,D,E"},
	{"Station": "Hoyt - Schermerhorn Sts", "Line":"A,C,G"},
	{"Station": "Nevins St", "Line":"2,3,4,5"},
	{"Station": "Hoyt St", "Line":"2,3"},
	{"Station": "Fulton St", "Line":"G"},
	{"Station": "Lafayette Ave", "Line":"C"}
]

console.log(stationName.length);

let StationList = [];
for (i=0; i<stationName.length; i++) {
	StationList[i] = stationName[i].Station
}


// let crowdData
// let noiseData

// let drawMap = () => {

// 	const projection = d3.geoMercator().fitSize([width, height], zipdata);

// 	canvas.append('g').selectAll('path')
// 			.data(zipdata)
// 			.enter()
// 			.append('path')
// 			.style("fill", "red")
// 			.style("stroke-width", "1")
// 			.style("stroke", "black")
// 			.attr('d', d3.geoPath(d3.geoMercator()))
// 			.attr('class','zipcode')

// };

d3.json(zipcodeURL).then(
	(data, error) => {
		if (error) {
			console.log(log)
		}else{
			let zipdata = data;
			console.log(zipdata)

			d3.json(stationURL).then(
				(data,error) => {
					if (error) {
						console.log(error)
					}else{
						let subwayData = data.features;
						console.log(subwayData);

						let selectedSbwy = [];
						var idx = 0;
						for (i=0; i<subwayData.length; i++) {
							if (StationList.includes(subwayData[i].properties.name)){
								selectedSbwy[idx] = subwayData[i]
								idx++
							}
						}

						const width = 900;
						const height = 600;

						var projection = d3.geoMercator()
									.fitSize([width,height], {type:'FeatureCollection',features:selectedSbwy});

						var path = d3.geoPath().projection(projection);

						var svgContainer = d3.select('#canvas')

						let canvas = svgContainer.append("svg")
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

						// let tooltip = d3.select('#tooltip')

						// create a tooltip
						var Tooltip = svgContainer
							.append("div")
							.attr("class", "tooltip")
							.style("opacity", 1)
							.style("background-color", "white")
							.style("border", "solid")
							.style("border-width", "2px")
							.style("border-radius", "5px")
							.style("padding", "5px")

						// Three function that change the tooltip when user hover / move / leave a cell
						var mouseover = function(d) {
						  Tooltip.style("opacity", 1)
						}
						var mousemove = function(d) {
							console.log(d3.mouse(this))
							Tooltip
								.html(d['properties'].name + "<br>" + d['properties'].line)
								.style("left", (d.event.pageX-800)+"px")
								.style("top", (d.event.pageY-800)+"px")
						}
						var mouseleave = function(d) {
							Tooltip.style("opacity", 0)
						}

						canvas.selectAll('circle')
								.data(selectedSbwy)
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

				}})
			//if fetch zipcode data, then continue to get the other data

			// drawMap()

		}

	});

let zipcodeURL = 'https://storage.googleapis.com/kagglesdsdata/datasets/355600/698418/nyc-zip-code-tabulation-areas-polygons.geojson?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcp-kaggle-com%40kaggle-161607.iam.gserviceaccount.com%2F20230627%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230627T031222Z&X-Goog-Expires=259200&X-Goog-SignedHeaders=host&X-Goog-Signature=2af59737501ce5d15769648ea19f3527cc260f79d6606b539d4a137723bca4c1986fe9016e2dab711dc88360a2b2ffee6a5559aa08e9e9f84716c208c125a1907fd80822f546093ade27a94ca0a6b0519dd8935b60c4dd0b504c4facb6242267b04ac8070252c669166a90cda2e746c31afd414a9f03356738d60701fd07a76aaf9c0dcd27bc1a80755d85542e30c584ad735eae0e71a3ee0fcd0b9c698033e9d25d4e19736e8ac98c463478e14a87486fca7d1c713aea2d452eae3d4e381644c343793ebb17391d14f033599e847679401ec2b93c81eaf617839e03eee238889b4952918fe0f94b144f38c96adc4ee866cac3b22d9b103b73a806c260e86792'
let stationURL = 'https://data.cityofnewyork.us/api/geospatial/arq3-7z49?method=export&format=GeoJSON'
let stationName = [
	{"Station": "Times Sq - 42nd St", "Line":"N,Q,R,W,S,1,2,3,7","id":["197","359","80","147"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489619472654-OOKBIWBA719JUTQIRUHU/02+Times+Square+Image.jpg?format=1500w"},
	{"Station": "42nd St - Port Authority Bus Term", "Line":"A,C,E","id":["362"],"URL":null},
	{"Station": "Grand Central - 42nd St", "Line":"S,4,5,6,7","id":["31","81","204"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1448456297288-3XYHEXHTFQOSV12Q1GQL/08+Grand+Central+Image.jpg?format=1500w"},
	{"Station": "Herald Sq - 34th St", "Line":"B,D,F,M,N,Q,R,W","id":["145","366"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489619473130-R9CG4467Z6Y0NWRB3BC6/03+Herald+Square+Image.jpg?format=1500w"},
	{"Station": "Union Sq - 14th St", "Line":"L,N,Q,R,W,4,5,6","id":["379","384","105"],"URL":"https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489619473235-8GN99XAVDHIBCJS8HX9I/05+Union+Square+Image.jpg?format=1500w"},
	{"Station": "Fulton St", "Line":"A,C,J,Z,2,3,4,5","id":["360","402","413","427"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489595200774-H89MMR14DA03J3J9MRCQ/06+Fulton+Street+Image.jpg?format=1500w"},
	{"Station": "59th St - Columbus Circle", "Line":"A,B,C,D,1","id":["94","353"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1448127714658-53QXRX8FZW9FVP87GCFA/01+Columbus+Circle+Image.jpg?format=1500w"},
	{"Station": "Lexington Ave - 59th St", "Line":"N,R,W,4,5,6","id":["49","357"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489619624400-WB7GRU4IGK1WZK5TI0ZE/10+Lexington+Avenue+-+59th+Street+Image.jpg?format=1500w"},
	{"Station": "Cortlandt St", "Line":"R,W,1","id":["426","429"],"URL":null},
	{"Station": "Chambers St/WTC/Park Pl", "Line":"A,C,E,2,3","id":["361","404","409","403"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489595077164-5128CIXB2G86Z694E2D8/21+WTC+Image.jpg?format=1500w"},
	{"Station": "47th-50th Sts - Rockefeller Ctr", "Line":"B,D,F,M","id":["349"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1509580002015-WA0RS5X2XXYBMYJKT74F/26+Rockefeller+Center.jpg?format=1500w"},
	{"Station": "Lexington Ave - 53rd St/51st St", "Line":"E,M,6","id":["143","85"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1490844217738-TXYLGPZMK9G3R4TUFU2X/22+53rd+Street+Lexington+Image.jpg?format=1500w"},
	{"Station": "42nd St/5th Ave - Bryant Pk", "Line":"B,D,F,M,7","id":["60","466"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1470109193956-MAQGBU9RQHT5SCJ62F98/15+42nd+Street+Bryant+Park.jpg?format=1500w"},
	{"Station": "Atlantic Av - Barclay's Center", "Line":"B,D,N,Q,R,2,3,4,5","id":["116","121","122"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1528171124070-E2DTW2ENLQK71Y30GMQN/23+Atlantic+Avenue+Barclays+Center.jpg?format=1500w"},
	{"Station": "14 St-6 Av", "Line":"F,M,1,2,3,L","id":["439","441"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1476551543181-3Q0DMXUIHUQUDXL0T02K/17+14th+Street+Image.jpg?format=1500w"},
	{"Station": "Canal St", "Line":"J,N,Q,R,W,Z,6","id":["415","417","435","2"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489619624197-GJSCLWBY7VNNWBPASYJS/07+Canal+Street+Image.jpg?format=1500w"},
	{"Station": "14 St-8 Av", "Line":"A,C,E,L","id":["444"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1469908614041-Z0X02FMM0YTHN97K7OX9/16+14th+Street+8th+Avenue+Image.jpg?format=1500w"},
	{"Station": "Jay St - MetroTech", "Line":"A,C,F,R","id":["368","377"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1528171123710-T3LDO6976CF78L771P2H/12+Jay+Street+Metro+Tech+Image.jpg?format=1500w"},
	{"Station": "W 4th St - Washington Sq", "Line":"A,B,C,D,E,F,M", "id":["84","206"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489595208746-0YR3SGQFLRI1UPAAAD1O/09+West+4+Image.jpg?format=1500w"},
	{"Station": "Broadway - Lafayette St/Bleecker St", "Line":"B,D,F,M,6","id":["433","457"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489595076784-XS4TYSB8ZWQO0DXLQGD2/19+Broadway+Lafayette.jpg?format=1500w"},
	{"Station": "Court St/Borough Hall", "Line":"R,2,3,4,5","id":["378","123","406"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1528171442199-ZZ47P70GP9DT3I1X39TR/25+Court+Street+Borough+Hall.jpg?format=1500w"},
	{"Station": "Delancey St - Essex St", "Line":"F,J,M,Z","id":["11","370"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489619740568-ADPJTUP8AT25QU70D8L6/18+Delancey+Essex.jpg?format=1500w"},
	{"Station": "Brooklyn Bridge - City Hall/Chambers St", "Line":"4,5,6,J,Z","id":["414","29"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489595076794-0T4TUCEZ0HCXKJTD2EGF/20+City+Hall+Image.jpg?format=1500w"},
	{"Station": "23rd St", "Line":"6,R,W","id":["92","380"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1489619472848-ZM4EBWE5N1PJC25OKA8I/04+Madison+Square+Image.jpg?format=1500w"},
	{"Station": "DeKalb Ave", "Line":"B,Q,R","id":["15"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1528678049652-KW4L9F70X3DJB7B40X5O/28+Dekalb.jpg?format=1500w"},
	{"Station": "5th Ave - 53rd St", "Line":"E,M","id":["142"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1469908613798-PKXH673NP10EM27PRK6T/14+5th+Avenue+53rd+Street+Image.jpg?format=1500w"},
	{"Station": "34th St - Hudson Yards", "Line":"7","id":["470"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1469908612565-0JTJ8ICIY1WS9FEDF6LS/11+34th+Street+Hudson+Yards+Image.jpg?format=1500w"},
	{"Station": "Hoyt - Schermerhorn Sts", "Line":"A,C,G","id":["367"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1528678049219-G5DYPMFI7FPYBY4MV9HU/27+Hoyt+Street+-+Schermerhorn+Street.jpg?format=1500w"},
	{"Station": "Nevins St", "Line":"2,3,4,5","id":["128"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1528678049791-IWP0YGQDB62C6IWJADWL/29+Nevins+Street.jpg?format=1500w"},
	{"Station": "Hoyt St", "Line":"2,3","id":["405"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1528678049175-LWLQ3ZUKFNJRC9H4TCL1/26+Hoyt.jpg?format=1500w"},
	{"Station": "Fulton St", "Line":"G","id":["118"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1528678050091-WMY9P122L3V828ZH88OU/30+Fulton+Street.jpg?format=2500w"},
	{"Station": "Lafayette Ave", "Line":"C","id":["454"],"URL": "https://images.squarespace-cdn.com/content/v1/55ababf2e4b064e8b6004ad2/1528678050181-U87SZSOLO7UL827F7NHF/31+Lafayette+ave.jpg?format=2500w"}
]

console.log(stationName.length);

let StationList = [];
for (i=0; i<stationName.length; i++) {
	StationList[i] = stationName[i].Station
}


// let crowdData
// let noiseData


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
						for (i=0; i<stationName.length;i++) {
							var idList = stationName[i]['id']
							let name = stationName[i]['Station']
							let line = stationName[i]['Line']
							let url = stationName[i]['URL']
							let notes = ''
							let coord0 = 0
							let coord1 = 0
							for (j=0; j<subwayData.length; j++) {
								if (idList.includes(subwayData[j].properties.objectid)){
									notes = notes+' '+subwayData[j].properties.notes
									coord0 += subwayData[j].geometry.coordinates[0]
									coord1 += subwayData[j].geometry.coordinates[1]
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

						console.log(selectedSbwy);


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
							.style("padding", "2px")

						// Three function that change the tooltip when user hover / move / leave a cell
						var mouseover = function(d) {
						  Tooltip.style("opacity", 1)
						}
						var mousemove = function(d) {
							console.log(d['properties'])
							Tooltip
								.html(d['properties'].name + "<br>" + d['properties'].line)
								.style("left", (d3.mouse(this)[0]+10) + "px")
								.style("top", (d3.mouse(this)[1]) + "px")
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
								.on("click", function(d){
									console.log('click',d.properties.url)
									d3.select("#picShow")
									.attr("src", d.properties.url)
									.attr("width", 400)
									.attr("height", 400);
								})
				}})
			//if fetch zipcode data, then continue to get the other data

			// drawMap()

		}

	});
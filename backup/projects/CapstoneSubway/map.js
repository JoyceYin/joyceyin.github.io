
let zipcodeURL = 'https://storage.googleapis.com/kagglesdsdata/datasets/355600/698418/nyc-zip-code-tabulation-areas-polygons.geojson?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcp-kaggle-com%40kaggle-161607.iam.gserviceaccount.com%2F20230627%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230627T031222Z&X-Goog-Expires=259200&X-Goog-SignedHeaders=host&X-Goog-Signature=2af59737501ce5d15769648ea19f3527cc260f79d6606b539d4a137723bca4c1986fe9016e2dab711dc88360a2b2ffee6a5559aa08e9e9f84716c208c125a1907fd80822f546093ade27a94ca0a6b0519dd8935b60c4dd0b504c4facb6242267b04ac8070252c669166a90cda2e746c31afd414a9f03356738d60701fd07a76aaf9c0dcd27bc1a80755d85542e30c584ad735eae0e71a3ee0fcd0b9c698033e9d25d4e19736e8ac98c463478e14a87486fca7d1c713aea2d452eae3d4e381644c343793ebb17391d14f033599e847679401ec2b93c81eaf617839e03eee238889b4952918fe0f94b144f38c96adc4ee866cac3b22d9b103b73a806c260e86792'
let stationURL = 'https://data.cityofnewyork.us/api/geospatial/arq3-7z49?method=export&format=GeoJSON'

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

						const width = 900;
						const height = 600;

						var projection = d3.geoMercator()
			                     .fitSize([width, height], zipdata);

						var path = d3.geoPath().projection(projection);

						let canvas = d3.select('#canvas')
									.attr('width', width).attr('height',height)
						canvas.selectAll('path')
							.data(zipdata.features)
							.enter()
							.append('path')
							.style("fill", "white")
							.style("stroke-width", "1")
							.style("stroke", "black")
							.attr('d', path)

						canvas.selectAll('circle')
								.data(subwayData)
								.enter().append('circle')
								.attr('r',3)
								.attr('cx',function(d) { return projection(d.geometry.coordinates)[0]})
								.attr('cy',function(d) { return projection(d.geometry.coordinates)[1]})
				}})
			//if fetch zipcode data, then continue to get the other data

			// drawMap()

		}

	});
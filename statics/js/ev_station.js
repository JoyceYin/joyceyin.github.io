function EVstationlevel(id){
    const width = 450, height=350;

    const svg = d3.select(id).append("svg")
                .attr("id", "station_ev_id")
                .attr("width", "100%").attr("height", "100%")
                .attr("viewBox","0 0 450 350")
                .attr("preserveAspectRatio", "xMinYMin");

    
    const poly = svg.append("g");
    const line = svg.append("g");

    //declare URL
    const dataURL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/ev_station_feature/ev_station_ny.json"
    const polygonsURL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/modified_zipcode.geojson"
    const polylinesURL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/ev_station_feature/ny_arterial_highway.json"

    

    //load and draw polygons first
    d3.json(polygonsURL, function(topo){
        //set map scale, location on screen and projection
        var projection = d3.geoMercator()
            .fitSize([width,height], {type:'FeatureCollection',features:topo.features});
        const generator = d3.geoPath().projection(projection);

        poly.selectAll("path")
            .data(topo.features)
            .enter().append("path")
            .style("fill", "#CCCCCC")
            .style("stroke", "black")
            .style("stroke-opacity", .2)
            .attr("d", generator)
            .attr("class", d => d.properties.type)


        //load lines
        d3.json(polylinesURL, function(topoline){
            line.selectAll("path")
                .data(topoline.features)
                .enter().append("path")
                .attr("class", "highway_line")
                .style("fill", "none")
                .style("stroke", "none")
                .style("stroke-width", 2)
                .style("stroke-opacity", .7)
                .attr("d", generator)
        } )
        
        //load data
        d3.json(dataURL, function(ev_station) {
            //filter
            var level2_station = ev_station.features.filter( function(d){return d.properties['EV Level2 EVSE Num']!=0} )
            var dcfc_station = ev_station.features.filter( function(d){return d.properties['EV DC Fast Count']!=0} )


            //set bubble scale
            // const valueScale = d3.extent(ev_station, d => +d[level])
            const size = d3.scaleLinear()
                            .domain([0,50])
                            .range([2,10]);

            svg.selectAll("level2Circle").data(level2_station)
                .enter().append("circle")
                .attr("class" , 'level2' )
                .attr("cx", function(d){ return projection(d.geometry.coordinates)[0]; } )
                .attr("cy", function(d){ return projection(d.geometry.coordinates)[1]; } )
                .attr("r", function(d){ return size(+d.properties['EV Level2 EVSE Num']) })
                .style("fill", function(d){
                    if (d.properties['EV Connector Types'].includes('TESLA')) {return "#cc0000"; }
                    else {return "#589BE5";}
                } )
                .attr("stroke", function(d){
                    if (d.properties['EV Connector Types'].includes('TESLA')) {return "#8b0000"; }
                    else {return "#0072BC";}
                } )
                .attr("stroke-width", 0.5)
                .attr("fill-opacity", .6)

            svg.selectAll("dcfcCircle").data(dcfc_station)
                .enter().append("circle")
                .attr("class" , 'dcfc' )
                .attr("cx", function(d){ return projection(d.geometry.coordinates)[0]; } )
                .attr("cy", function(d){ return projection(d.geometry.coordinates)[1]; } )
                .attr("r", function(d){ return size(+d.properties['EV DC Fast Count']) })
                .style("fill", function(d){
                    if (d.properties['EV Connector Types'].includes('TESLA')) {return "#cc0000"; }
                    else {return "#00A86B";}
                } )
                .attr("stroke", "#184632")
                .attr("stroke-width", .5)
                .attr("stroke-opacity", 0)
                .attr("fill-opacity", 0)
        })

        //set note
        svg.append('text')
            .attr('class', 'note')
            .attr('x', width/1.9)
            .attr('y', height*0.96)
            .attr('text-anchor', 'start')
            .style('font-size', 7)
            .style("fill", "#666666")
        .text('Source: NYSERDA - Electric Vehicle Station Locator');

        svg.append('text')
            .attr('class', 'note')
            .attr('x', width/1.7)
            .attr('y', height*0.99)
            .attr('text-anchor', 'start')
            .style('font-size', 7)
            .style("fill", "#666666")
        .text('Arterial Highways and Major Streets');

        //set legend
        svg.append('circle').attr("cx", width*0.02 )
                .attr("cy", height/2)
                .attr("r", 3)
                .style("fill",  "#cc0000")
        svg.append("text").attr("class", "teslalegend-text")
            .attr("x", width*0.02 + 10)
            .attr("y", height/2)
            .style('font-size', 8)
            .style("fill", "#666666")
            .attr("alignment-baseline", "middle").text('Tesla Level 2 Charge')

        svg.append('circle').attr("cx", width*0.02 )
                .attr("class", "csslegend")
                .attr("cy", height/2+10)
                .attr("r", 3)
                .style("fill",  "#589BE5")
        svg.append("text").attr("class", "csslegend-text")
            .attr("x", width*0.02 + 10)
            .attr("y", height/2+10)
            .style('font-size', 8)
            .style("fill", "#666666")
            .attr("alignment-baseline", "middle").text('Level 2 with J1772')

        //set title
        svg.append("text").attr("class", "maptitle")
            .attr("x", width*0.02)
            .attr("y", 40)
            .style('font-size', 16)
            .style("fill", "#0e0b16;")
            .style("font-weight", "600")
            .attr('text-anchor', 'start').text('EV Level 2 Charging Stations')
    } )

    return svg;

}

var evcs_id = "#ev_station_level"
// initial level 2 station
evcs_svg = EVstationlevel(evcs_id)

// When a button change, update plot
d3.selectAll(".checkbox").on("click", function(){
    console.log(this.value);
    if (this.value == 'level2') {
        evcs_svg.selectAll(".dcfc").transition().duration(100).attr("stroke-opacity", 0).attr("fill-opacity", 0)
        evcs_svg.selectAll(".highway_line").transition().duration(100).style("stroke", "none")
        evcs_svg.selectAll(".level2").transition().duration(1000).attr("stroke-opacity", 1).attr("fill-opacity", .7)

        evcs_svg.selectAll(".teslalegend-text").transition().text('Tesla Level 2 Charge')
        evcs_svg.selectAll(".csslegend").transition().style("fill", "#589BE5")
        evcs_svg.selectAll(".csslegend-text").transition().text('Level 2 with J1772')

        evcs_svg.selectAll(".maptitle").transition().duration(500).text('EV Level 2 Charging Stations')
    } else{
        evcs_svg.selectAll(".level2").transition().duration(100).attr("stroke-opacity", 0).attr("fill-opacity", 0)
        evcs_svg.selectAll(".highway_line").transition().duration(1000).style("stroke", "#FFF03A")
        evcs_svg.selectAll(".dcfc").transition().duration(1000).attr("stroke-opacity", 1).attr("fill-opacity", .7)

        evcs_svg.selectAll(".teslalegend-text").transition().text('Tesla SuperCharge')
        evcs_svg.selectAll(".csslegend").transition().style("fill", "#00A86B")
        evcs_svg.selectAll(".csslegend-text").transition().text('DCFC with CSS/CHAdeMO')

        evcs_svg.selectAll(".maptitle").transition().duration(500).text('EV Fast Charging Stations')

    }
});


function InvestmentPie(id){
    // set the dimensions and margins of the graph
    const margin = 80, height = 450, width = 450

    // append the svg object to the body of the page
    const svg = d3.select(id).append("svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("viewBox", "0 0 450 450")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .append("g")
                    .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const radius = Math.min(width, height) / 2 - margin

    var data = {"Private Charging": 52, "Public Fast Charging": 39, "Public Destination Charing":9}

}

var piechart_id = "#investment_piechart"
InvestmentPie(piechart_id)
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
    const margin = 80, height = 500, width = 500

    // append the svg object to the body of the page
    const svg = d3.select(id).append("svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("viewBox", "0 0 450 450")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .append("g")
                    .attr("transform", "translate("+ width / 2 + "," + height / 2 +")");

    const radius = Math.min(width, height) / 2 - margin

    var data = {"Public Destination Charging":9, "Private Charging": 52, "Public Fast Charging": 39}
    var port_data = {"Private Charging": 26762000, "Public Fast Charging": 182000, "Public Destination Charging": 1067000}

    // set the color scale
    var color = d3.scaleOrdinal()
                    .domain(data)
                    .range(["#8EBEFF","#191970","#0072BC"]);

    // Compute the position of each group on the pie:
    var pie = d3.pie().value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data))

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    var inarc = d3.arc()
        .innerRadius(radius * 0.5)         
        .outerRadius(radius * 0.8)
    var outerArc = d3.arc()
        .innerRadius(radius*1)
        .outerRadius(radius*1)

    // create a tooltip
    const tooltip = d3.select("body")
                    .append("div").attr("class", "tooltip");

    // tooltip events
    const mouseover = function(d) {
                    tooltip.style("opacity", 1)
                    d3.select(this).style("opacity", .5)
    };
    const mouseleave = function(d) {
                    tooltip.style("opacity", 0)
                    d3.select(this).style("opacity", 1)
    };

    svg.selectAll('mySlices')
        .data(data_ready).enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "4px")
        .style("opacity", 0.7)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .append("title").text( function (d) { return `${d.data.key} \n${d.data.value}% national investment` } );

    svg.append("g")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(data_ready).enter()
            .append('text')
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
            .style('font-size', 12)
            .attr("fill", "#ffffff")
            .call(text => text.append("tspan")
                    .attr("x", "0.2em")
                    .attr("y", "-0.6em")
                    .text(function(d) {if (d.data.value>10) {return d.data.key;}} ))
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .text(function(d) {if (d.data.value>10) {return port_data[d.data.key].toLocaleString()+" ports";}} ))

    // Add the polylines between chart and labels:
    svg
        .selectAll('allPolylines')
        .data(data_ready).enter()
        .append('polyline')
        .attr("stroke", "#222222")
        .style("fill", "none")
        .attr("stroke-width", 2)
        .attr('points', function(d) {
            if (d.data.value < 10) {
                var posA = inarc.centroid(d) // line insertion in the slice
                var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                var posC = outerArc.centroid(d); // Label position = almost the same as posB
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.5 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
            }
        })

    svg
        .selectAll('allLabels')
        .data(data_ready).enter()
        .append('text')
        .attr('transform', function(d) {
              var pos = outerArc.centroid(d);
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
              pos[0] = radius * 0.54 * (midangle < Math.PI ? 1 : -1);
              return 'translate(' + pos + ')';
          })
        .style('text-anchor', function(d) {
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
              return (midangle < Math.PI ? 'start' : 'end')
          })
        .style('font-size', 12)
        .attr("fill", "#222222")
        .call(text => text.append("tspan")
                    .attr("x", "0.2em")
                    .attr("y", "-0.6em")
                    .text(function(d) { if (d.data.value<10) {return d.data.key; } }))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .text(function(d) { if (d.data.value<10) {return port_data[d.data.key].toLocaleString()+" ports"; } } ))

    // set title
    svg
    .append("text")
    .attr("class", "chart-title")
    .attr("text-anchor", "start")
    .call( text => text.append("tspan")
            .attr("x", -(margin))
            .attr("y", -(margin/2+radius))
            .text("National Charging Network Supporting"))
    .call(text => text.append("tspan")
            .attr("x", 0)
            .attr("y", -(margin/2+radius-20))
            .text( "33 Million LD PEVs by 2030" ))

}

var piechart_id = "#investment_piechart"
InvestmentPie(piechart_id)

function simulatedPorts(id, data, type){
    // set the dimensions and margins of the graph
    const margin = 100,height = 500,width = 500
    // The radius of the pieplot is half the width or half the height (smallest one). subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin   
    // append the svg object to the body of the page
    const svg = d3.select(id).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", "0 0 450 450")
            .attr("preserveAspectRatio", "xMinYMin")
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // set the color scale
    var color = d3.scaleOrdinal().domain(data)
    .range(['#efb118','#ff725c','#6cc5b0','#97bbf5'].slice(0, data.length))

    // Compute the position of each group on the pie:
    var pie = d3.pie().value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data))
    const total = d3.sum(Object.values(data))
    var arc = d3.arc().innerRadius(radius/2.2).outerRadius(radius)

    var inarc = d3.arc()
        .innerRadius(radius * 0.8)         
        .outerRadius(radius * 0.8)
    var outerArc = d3.arc()
        .innerRadius(radius*1)
        .outerRadius(radius*1.2)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.selectAll('path')
        .data(data_ready).enter()
        .append('path')
        .attr('d', arc )
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "#ffffff")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    svg.append("g")
        .attr("text-anchor", "middle").selectAll("text")
        .data(data_ready).enter()
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("x", "0.2em")
            .attr("y", "-0.6em")
            .attr("fill", "#222222")
            .text(function(d) {if (d.data.value/total>0.1) {return d.data.key;}} ))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill", "#222222")
            .text(function(d) {if (d.data.value/total>0.1) {return d.data.value.toLocaleString();}} ))

    //For small portion, extend label outside the circle with polyline
    svg
        .selectAll('allPolylines')
        .data(data_ready).enter()
        .append('polyline')
        .attr("stroke", "#222222")
        .style("fill", "none")
        .attr("stroke-width", 2)
        .attr('points', function(d) {
            if (d.data.value/d3.sum(Object.values(data))<=0.1) {
                var posA = inarc.centroid(d) // line insertion in the slice
                var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                var posC = outerArc.centroid(d); // Label position = almost the same as posB
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.5 * (midangle > 6.1 ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
            }
        })

    svg
        .selectAll('allLabels')
        .data(data_ready).enter()
        .append('text')
        .attr('transform', function(d) {
              var pos = outerArc.centroid(d);
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
              pos[0] = radius * 0.54 * (midangle > 6.1 ? 1 : -1);
              return 'translate(' + pos + ')';
          })
        .style('text-anchor', function(d) {
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
              return (midangle > 6.1 ? 'start' : 'end')
          })
        // .style('font-size', 12)
        .attr("fill", "#222222")
        .call(text => text.append("tspan")
                    .attr("x", "0.2em")
                    .attr("y", "-0.6em")
                    .text(function(d) {if (d.data.value/total<=0.1) {return d.data.key;}} ))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.1).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .text(function(d) { if (d.data.value/total<=0.1) {return d.data.value.toLocaleString();} } ))

    //data label for total
    const f = d3.format(",.0f");
    svg.append("text")
        .attr("dy", "-1em")
        .style("font-size", "12px").style("text-anchor", "middle")
        .attr("class", "inner-circle")
        .attr("fill", "#222222").text("Total ports");

    svg.append("text")
        .attr("dy", "0.5em")
        .style("font-size", "16px").style("text-anchor", "middle")
        .attr("class", "inner-circle")
        .attr("fill", "#222222").text(f(total) + " ports");

    // set title
    svg.append("text")
    .attr("class", "chart-title")
    .attr("text-anchor", "start")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .call( text => text.append("tspan")
                    .attr("x", -(margin+radius))
                    .attr("y", -(margin/1.2+radius))
                    .text("NY Port Summary for Simulated 2023 "+type+" Network"))

    // calculation
    svg.append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .attr("x", 0)
        .attr("y", margin/3+radius)
        .text(function(d) {if (type=='Private'){return "≈ "+ Math.round((((total-data['Single-Family Homes'])/1420000 )*100 )*10)/10+" ports/100 Plug-in EVs (exclude SFHs)";}
                            else {return "≈ "+ Math.round(((total/1420000)*100)*10)/10+" ports/100 Plug-in EVs";} } )
}


var private_id = "#private_simulated"
var private_data = {'Single-Family Homes': 1086000, 'Multi-Family Homes':53900,'Workplace':21400}

var dcfcst_id = "#dcfc_simulated"
var dcfcport_data = {'DC 150':2500,'DC 250':1800,'DC 350+':2000}

var level2st_id = "#level2_simulated"
var level2port_data = {'Neighborhood':14100,'Office':7200,'Retail':8600,'Other':15400}

simulatedPorts(private_id, private_data, 'Private')
simulatedPorts(dcfcst_id, dcfcport_data,'Public DC')
simulatedPorts(level2st_id, level2port_data, 'Public L2')
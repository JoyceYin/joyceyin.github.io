function EVstationlevel(id, level){
    const width = 450, height=350;

    const svg = d3.select(id).append("svg")
                .attr("id", "station_ev_id")
                .attr("width", "100%").attr("height", "100%")
                .attr("viewBox","0 0 450 350")
                .attr("preserveAspectRatio", "xMinYMin");

    

    const poly = svg.append("g");
    const line = svg.append("g");
    const bubble = svg.append("g");

    //declare URL
    const dataURL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/ev_station_feature/ev_station_nyc.csv"
    const polygonsURL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/modified_zipcode.geojson"
    const polylinesURL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/ev_station_feature/ny_arterial_highway.json"

    

    //load and draw polygons first
    d3.json(polygonsURL).then( function(topo){
        //set map scale, location on screen and projection
        var projection = d3.geoMercator()
            .fitSize([width,height], {type:'FeatureCollection',features:topo.features});
        const generator = d3.geoPath().projection(projection);

        poly.selectAll("path")
            .data(topo.features)
            .join("path")
            .style("fill", "#CCCCCC")
            .style("stroke", "black")
            .style("stroke-opacity", .2)
            .attr("d", generator)
            .attr("class", d => d.properties.type)


        //load lines
        d3.json(polylinesURL).then(function(topoline){
            line.selectAll("path")
                .data(topoline.features)
                .join("path")
                .style("fill", "none")
                // .attr("points", function(d){console.log(d.geometry.coordinates); return d.geometry.coordinates; } )
                .style("stroke", "red")
                .style("stroke-width", 2)
                .attr("d", generator)
                .attr("class", d => d.properties.type)
        } )
        
        //load data
        // d3.csv(dataURL).then(function(ev_station) {
        //     //set bubble scale
        //     const valueScale = d3.extent(ev_station, d => +d[level])
        //     const size = d3.scaleSqrt()
        //                     .domain(valueScale)
        //                     .range([5,20]);

        //     bubble.selectAll("circle").data(ev_station)
        //         .join("circle")
        //         .attr("class" , function(d){ return level; })
        //         .attr("cx", d => projection(Number(d['Longitude']), Number(d['Latitude']))[0] )
        //         .attr("cy", d => projection(+d['Longitude'], +d['Latitude'])[1] )
        //         .attr("r", d => size(+d[level]))
        //         .style("fill", function(d){
        //             if (level == 'EV Level2 EVSE Num') { return "#589BE5"; }
        //             else {return "#C2DAB8"; }
        //         })
        //         .attr("stroke", function(d) {
        //             if (level == 'EV Level2 EVSE Num') { return "#0072BC"; }
        //             else {return "#184632"; }
        //         })
        //         .attr("stroke-width", 0.5)
        //         .attr("fill-opacity", .6)
        // })
    } )

}

var evcs_id = "#ev_station_level"
EVstationlevel(evcs_id, 'EV Level2 EVSE Num')
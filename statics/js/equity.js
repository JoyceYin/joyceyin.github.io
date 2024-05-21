function equityBaseMap(type,id){
    const width=450, height=350;
    const svg = d3.select(id).append("svg")
                .attr("id", "equity_id")
                .attr("width", "100%").attr("height", "100%")
                .attr("viewBox","0 0 450 350")
                .attr("preserveAspectRatio", "xMinYMin");
    
    const poly = svg.append("g");

    //declare URL
    const censustractURL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/ev_equity_data/census_tract.geojson"
    const walk15URL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/ev_equity_data/EVSE_walk_within15.csv"
    const drive15URL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/ev_equity_data/EVSE_drive_within15.csv"

    d3.json(censustractURL, function(topo){
        //set map scale, location on screen and projection
        var projection = d3.geoMercator()
            .fitSize([width,height], {type:'FeatureCollection',features:topo.features});
        const generator = d3.geoPath().projection(projection);

        //census tract
        poly.selectAll("path")
            .data(topo.features)
            .enter().append("path")
            .style("fill", "#CCCCCC")
            .attr("d", generator)
            .attr("class", d => d.properties.type)

        //walking and driving 
        if (type=='walk') {
            var url=walk15URL, col='Walk15_EVSE';
        }else{ var url=drive15URL, col="Drive15_EVSE"; }
        
        //density map
        d3.csv(url, function(density){
            var geoArray = density.map(function (d) { return d.GEOID; })
            var colorScale = d3.scaleThreshold()
                    .domain([-1, 0.01, 10.01, 25.01, 50.01])
                    .range(['#999999','#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']);
            
            svg.append("g").selectAll("path")
                .data(topo.features.filter((d) => geoArray.includes(d.properties['GEOID']) ))
                .enter().append("path")
                .style("fill", function (d) {
                    count = density.find((e) => e.GEOID == d.properties['GEOID'] )[col]
                    return colorScale(count)
                })
                .style("stroke", "grey")
                .style("stroke-opacity", .1)
                .attr("d", generator)

            //set legend
            svg.append("g")
            .attr("class", "legendThreshold")
            .attr("transform", "translate("+ (width-60) +",260)")
            .style("font-size", 8);

            const legend = d3.legendColor().labels(['No data','0', '1-10', '11-25', '26-50', '51-'])
                            .labelOffset(3)
                            .shapePadding(-2)
                            .scale(colorScale)
                            
            svg.select(".legendThreshold").call(legend);


        })
    })
}

var walk15_id = "#walk15_map"
equityBaseMap('walk',walk15_id)

var drive15_id = "#drive15_map"
equityBaseMap('drive',drive15_id)
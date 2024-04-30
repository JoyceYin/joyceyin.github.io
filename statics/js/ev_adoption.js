function transition(path) {
    path.transition()
        .duration(2000)
        .attrTween("stroke-dasharray", tweenDash)
  }

function tweenDash() {
    const l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) { return i(t) };
  }

function EVadoption_line(id, data){

    const margin = {top: 80, right: 20, bottom: 50, left: 40};
    const width = 450 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    const svg = d3.select(id).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 450 350")
        .attr("preserveAspectRatio", "xMinYMin")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
          
    //Read the data
    d3.csv(data, function(data) {

        const parseTime = d3.timeParse("%Y")
        //nest function allows to group the calculation
        const dataGrouped = d3.nest().key(d => d.Borough).entries(data);
        console.log(dataGrouped)

        // list of value keys
        const typeKeys = ["Brooklyn", "Manhattan", "Bronx", "Queens", "Staten Island"];

        //x scale and axis
        var xExtent = d3.extent(data, d => parseTime(d.Year))
        const xScale = d3.scaleTime().domain( [xExtent[0].setFullYear(xExtent[0].getFullYear() - 1), xExtent[1].setFullYear(xExtent[1].getFullYear()+1)] )
                        .range([0, width]);
        svg.append('g')
            .attr("transform", "translate(0," + height + ")" )
            .call(d3.axisBottom(xScale).tickValues( [... new Set(data.map(item => parseTime(item.Year)))] ).tickSize(0).tickPadding(8))
            .selectAll("text")
            .attr("transform", "rotate(0)")

        //y scale and axis
        const formatter = d3.format(".2s")
        const yScale = d3.scaleLinear().domain( [0, d3.max(data, d => +d['Vehicle Count'])] )
                        .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(yScale).ticks(8).tickSize(0).tickPadding(8).tickFormat(formatter) )
            .call(d => d.select(".domain").remove())

        // set horizontal grid line
        const GridLine = () => d3.axisLeft().scale(yScale);
        svg.append("g")
            .attr("class", "grid")
            .call( GridLine().tickSize(-width,0,0).tickFormat("").ticks(6) )
            

        // color palette
        const color = d3.scaleOrdinal().domain(typeKeys).range(d3.schemeCategory10.slice(0,5));
        console.log(d3.schemeCategory10.slice(0,5))

        //add transition
        const transitionPath = d3.transition().duration(2500);

        // create line
        const lines = svg.selectAll(".line").data(dataGrouped).enter().append("path")
                        .attr("fill", "none")
                        .attr("stroke", function(d){ return color(d.key) })
                        .attr("stroke-width", 2)
                        .attr("d", function(d) {
                            return d3.line()   //.curve(d3.curveCardinal)
                                .x(function(d) { return xScale(parseTime(d.Year)); })
                                .y(function(d) { return yScale(+d['Vehicle Count']); })
                                (d.values)
                        })
                        .attr('class', 'temperature-line')
                        .call(transition);;


        //add vertical line
        svg.append("line")
            .attr("x1", xScale(parseTime('2019')))  //<<== change your code here
            .attr("y1", height - margin.top - margin.bottom)
            .attr("x2", xScale(parseTime('2019')))  //<<== and here
            .attr("y2", height)
            .style("stroke-dasharray", 3)
            .style("stroke-width", 2)
            .style("stroke", "#999999")
            .style("opacity", 0.6)
            .style("fill", "#999999");

        //set title
        svg.append("text").attr("class", "chart-title")
                        .attr("x", -(margin.left)*0.7)
                        .attr("y", -(margin.top)/1.5)
                        .attr("text-anchor", "start")
                        .text("EV Adoption across Borough as of 2023")

        // set Y axis label
        svg.append("text").attr("class", "chart-label")
                        .attr("x", -(margin.left)*0.7)
                        .attr("y", -(margin.top)/9)
                        .attr("text-anchor", "start")
                        .text("Number of Electric Vehicle (thousands)")

        //set copyright
        svg.append("text").attr("class", "copyright")
                        .attr("x", -(margin.left)*0.7)
                        .attr("y", height+margin.bottom*0.9)
                        .attr("text-anchor", "start")
                        .text("©New York State DOT, organized by Atlas")

        for (let i=0; i<typeKeys.length; i++ ){
            svg.append('circle').attr("cx", -(margin.left)*(0.6-1.9*i) )
                .attr("cy", -(margin.top/2.5))
                .attr("r", 5)
                .style("fill", color(typeKeys[i]) )
            svg.append("text").attr("class", "legend")
                .attr("x", -(margin.left)*(0.6-1.9*i)+10)
                .attr("y", -(margin.top/2.5))
                .attr("alignment-baseline", "middle").text(typeKeys[i])
        }
    })

}

// Chorepleth Map
function Chorepleth_map(id, year) {

    //if canvas existed, remove first
    d3.select("#map_svg_id").remove();

    //set svg parameters
    const width = 350, height=350;
    const svg = d3.select(id).append("svg")
                .attr("id","map_svg_id")
                .attr("width", "100%").attr("height","100%")
                .attr("viewBox","0 0 450 350")
                .attr("perserveAspectRatio", "xMinYMin")

    // Map and projection
    var path = d3.geoPath();
    // Data and color scale
    // for Nan, grey
    var data = d3.map();
    var colorScale = d3.scaleThreshold()
    .domain([0, 0.1, 0.3, 0.5, 1, 2])
    .range(["#999999", '#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c']);

    // Load external data and boot
    d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/modified_zipcode.geojson")
    .defer(d3.csv, 'https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/ev_per_household/ev_adoption_'+ year.toString() +'.csv', function(d) { data.set(d.MODZCTA, +d.ev_per_household); })
    .await(ready);

    console.log(data)

    function ready(error, topo) {
        var projection = d3.geoMercator()
                .fitSize([width,height], {type:'FeatureCollection',features:topo.features});

        let mouseOver = function(d) {
            if (data.get(d.properties.MODZCTA) || 0 != 0){
                d3.selectAll(".Country")
                    .transition()
                    .duration(100)
                    .style("opacity", .3)
                d3.select(this)
                    .transition()
                    .duration(100)
                    .style("opacity", 1)
            }
            }
        
        let mouseLeave = function(d) {
            if (data.get(d.properties.MODZCTA) || 0 != 0){
                d3.selectAll(".Country")
                    .transition()
                    .duration(100)
                    .style("opacity", 1)
                d3.select(this)
                    .transition()
                    .duration(100)
                    .style("opacity", 1)
            }
            }

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            // draw each country
            .attr("d", path.projection(projection))
            // set the color of each country
            .attr("fill", function (d) {
                // console.log(d)
                // console.log(d.properties.MODZCTA, typeof(d.properties.MODZCTA))
                d.total = data.get(d.properties.MODZCTA) || 0;
                
                if (d.total == 0){
                    return "#999999"
                }else{
                    return colorScale(d.total);
                }
            })
            .style("stroke", "grey")
            .style("stroke-width", 0.5)
            .attr("class", function(d){ return "Country" } )
            .style("opacity", .8)
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )
            .append("title")
            .text(function(d) {
                return "Area: " + d.properties.MODZCTA + "\nEV per Household: " + Number((data.get(d.properties.MODZCTA)).toFixed(3))
            });

        }

    //set legend
    svg.append("g")
        .attr("class", "legendThreshold")
        .attr("transform", "translate("+ (width-10) +",240)");

    const legend = d3.legendColor().labels(['No data', 'Less than 0.1', '0.1 to 0.3', '0.3 to 0.5', '0.5 to 1', '1 or more'])
                    .labelOffset(3)
                    .shapePadding(2)
                    .scale(colorScale)
    svg.select(".legendThreshold").call(legend);

    //set note 
    svg.append('text').attr('class', 'note')
        .attr('x', width*0.3)
        .attr('y', height)
        .attr("text-anchor", "start")
        .style("font-size", 8)
        .style("fill", "#999999")
        .text("Source: EV adoption from NYSDOT, Household data from ACS 5-Year Data in 2017 and 2022")

    //add title
    svg.append('text').attr('class', 'maptitle')
        .attr('x', 0)
        .attr('y', 10)
        .attr("text-anchor", "start")
        .style("font-size", 15)
        .style("font-weight", 600)
        .text("EV per car-owning household")

    svg.append('text').attr('class', 'maptitle')
        .attr('x', 0)
        .attr('y', 30)
        .attr("text-anchor", "start")
        .style("font-size", 15)
        .style("font-weight", 600)
        .text("in "+year)
}

    

var ev_adopt_boro = 'https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/ev_adoption_boro_year.csv'
var ev_adopt_id = '#ev_adoption_boro'
EVadoption_line(ev_adopt_id, ev_adopt_boro)



var ev_map_id = '#ev_chorepleth_map', year=2023
Chorepleth_map(ev_map_id, year)

//update chorepleth map when the slider is moved
d3.select("#mapSlider").on("change", function(d){
    selectedValue = this.value
    console.log(selectedValue)
    Chorepleth_map(ev_map_id, selectedValue)
  })
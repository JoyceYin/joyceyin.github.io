function getKeyByValue(object, value) {
    key = Object.keys(object).find(key => object[key] === value)
    return object[key+'_val'];
  }

function market_stacked_bar(id, type, year){
    //remove canvas and tooltip

    //set the dimensions and margins of the graph
    const margin = {top:80, right:20, bottom:50, left:120};
    const width = 450 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    //append the svg object to the body of the page
    const svg = d3.select(id).append("svg")
                .attr('id', type+'_market_type')
                .attr('width', "100%").attr("height", "100%")
                .attr("viewBox","0 0 450 350")
                .attr("preserveAspectRatio", "xMinYMin")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top+")")

    //prepare the data
    d3.csv("https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/bev_phev_car_data/"+ type +"_top5_"+ year +".csv",function(data){
        
        var subgroups = data.columns.slice(1).filter(d => !d.includes('_val'));
        //add columns for  total number
        for (i=0; i<data.length; i++) {
            var sum = 0;
            for (k=0; k<subgroups.length; k++) { data[i][subgroups[k]]=Number(data[i][subgroups[k]]); sum+=data[i][subgroups[k]]; }
            data[i].total = sum;
        }
        //sort data in descending order by total
        data.sort( (a,b) => b.total-a.total );
        
        //stack the data
        const stack = d3.stack().keys(subgroups)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone)

        const stackedData = stack(data);
        console.log(stackedData);

        //x scale and axis
        const formater = d3.format(".1s")
        const xScale = d3.scaleLinear().domain([0, 45000]).range([0,width])
        svg.append("g").attr("transform", "translate(0,"+height+")")
            .call(d3.axisBottom(xScale).ticks(5).tickSize(0).tickPadding(6).tickFormat(formater))
            .call(d => d.select(".domian").remove());

        //y scale and axis
        const yScale = d3.scaleBand().domain(data.map(d => d['Vehicle Make']))
                            .range([0, height]).padding(.2);
        svg.append("g").call(d3.axisLeft(yScale).tickSize(0).tickPadding(8));

        //set color
        const color  = d3.scaleOrdinal().domain(subgroups)
                    .range(d3.schemeTableau10.slice(0, subgroups.length))

        console.log(d3.schemeTableau10.slice(0, subgroups.length))

        //set vertical grid line
        const GridLine = function() {return d3.axisBottom().scale(xScale)};
        svg.append("g").attr("class", "grid")
            .call(GridLine().tickSize(height,0,0).tickFormat("").ticks(8));

        var Tooltip = d3.select(id)
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("border", "solid")
                .style("border-width", "2px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            Tooltip.style("opacity", .8)
            d3.select(this).style("opacity", .5)
        }
        var mousemove = function(d) {
            Tooltip.html("Car Model:"+getKeyByValue(d.data, d[1]-d[0])+"<br>Value: "+(d[1]-d[0]))
                .style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.event.pageY) + "px")
        }
        var mouseleave = function(d) {
            Tooltip.style("opacity", 0)
            d3.select(this).style("opacity", 1)
        }

        //create bars
        svg.append("g").selectAll("g")
            .data(stackedData).enter().append("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d).enter().append("rect")
            .attr("x", d => xScale(d[0]) )
            .attr("y", d => yScale(d.data['Vehicle Make']) )
            .attr("width", d=> xScale(d[1])-xScale(d[0]) )
            .attr("height", yScale.bandwidth() )
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        //set title
        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", -(margin.left)*0.5)
            .attr("y", -(margin.top)/2)
            .attr("text-anchor", "start")
            .text(year + " Top 5 Companies in " + type + " Market")

        //set Y axis label
        svg.append("text")
            .attr("class", "chart-label")
            .attr("x", width/2)
            .attr("y", height+margin.bottom/2)
            .attr("text-anchor", "middle").text("Number of Vehicles (thousands)")

        //set chart explanation
        svg.append("text").attr("class", "chart-source")
            .attr("x", -(margin.left)*0.5)
            .attr("y", -(margin.top)/2 + 20)
            .attr("text-anchor", "start")
            .text("Color in the chart represents different car models")

        svg.append("text").attr("class", "chart-source")
            .attr("x", -(margin.left)*0.5)
            .attr("y", -(margin.top)/2 + 30)
            .attr("text-anchor", "start")
            .text("Use mouse tooltip to check car model")
    })
}

var bev_id = "#bev_stacked_bar"
var phev_id = "#phev_stacked_bar"

market_stacked_bar(bev_id, 'BEV', 2023)
market_stacked_bar(phev_id, 'PHEV', 2023)

//update chorepleth map when the slider is moved
d3.select("#barSlider").on("change", function(d){
    selectedValue = this.value
    console.log(selectedValue)
    d3.select('#BEV_market_type').remove();
    d3.select('#PHEV_market_type').remove();
    market_stacked_bar(bev_id, 'BEV', selectedValue)
    market_stacked_bar(phev_id, 'PHEV', selectedValue)
  })
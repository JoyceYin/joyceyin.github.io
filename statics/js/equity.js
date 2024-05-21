function equityBaseMap(type){
    const width=450, height=350;
    const svg = d3.select(id).append("svg")
                .attr("id", "equity_id")
                .attr("width", "100%").attr("height", "100%")
                .attr("viewBox","0 0 450 350")
                .attr("preserveAspectRatio", "xMinYMin");

    
    const poly = svg.append("g");
    const line = svg.append("g");

    //declare URL
    const censustractURL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/ev_station_feature/ev_station_ny.json"
    const walk15URL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/modified_zipcode.geojson"
    const drive15URL = "https://raw.githubusercontent.com/JoyceYin/joyceyin.github.io/main/statics/data/ev_station_feature/ny_arterial_highway.json"

    
}

var walk15_id = "#walk15_map"

var drive15_id = "#drive15_map"
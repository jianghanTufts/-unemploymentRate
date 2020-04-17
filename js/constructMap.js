var pageWidth = $("body").width();
var pageHeight = $("body").width()
var svg = d3.select("svg"),
    width = pageWidth * 0.8,
    height = pageHeight * 0.8;
var rateById = d3.map();

var color1 = d3.scaleLinear()
    .domain([0, 50])
    .range(['#4a69bd', '#b33939'])
    .interpolate(d3.interpolateHcl);

var projection = d3.geoAlbersUsa()
    .scale(width)
    // .translate([-50, -50])
    .translate([width * 0.5, height * 0.3 ]);

var path = d3.geoPath()
    .projection(projection);

d3.queue()
    .defer(d3.json, "js/us.json")
    .defer(d3.csv, "csv/2010_country_data_utf8.csv", function(d) {
        //var droughtRate = (parseFloat(d.D0) + 2 * parseFloat(d.D1) + 3*parseFloat(d.D2) + 4*parseFloat(d.D3) + 5*parseFloat(d.D4) + 1)/1500;
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        rateById.set(connected_id, unemplyment_rate);
    })
    .await(ready);
function ready(error, us) {
    if (error) throw error;
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class",function(d){
            var stateId = parseInt(d.id / 1000);
            return "county-"+d.id + " state-" + stateId;
        })
        .attr("data-fill",function(d) {
            return color1(rateById.get(d.id));
        })
        .style("fill", function(d) {
            return color1(rateById.get(d.id));
        })
        .on("mouseover",handleMouseOverMap)
        .on("mouseout",handleMouseOutMap)
        .on("click ",handleMouseClickMap);

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("d", path);
}

function handleMouseOverMap(d){
    var stateId = parseInt(d.id / 1000);
    $(".state-"+stateId).css("fill","orange");
    console.log($(this).data("fill"));
}
function handleMouseOutMap(d){
    var stateId = parseInt(d.id / 1000);
    $(".state-"+stateId).each(function(){
        $(this).css("fill",$(this).data("fill"));
    });
}
function handleMouseClickMap(d, i){
    console.log(d);
    console.log(i);
}
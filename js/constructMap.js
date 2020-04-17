var pageWidth = $("body").width();
var pageHeight = $("body").width()
var svg = d3.select("svg"),
    width = pageWidth * 0.7,
    height = pageHeight * 0.8;
var rateById = d3.map();

var color1 = d3.scaleLinear()
    .domain([0, 20])
    .range(['#4a69bd', '#682828'])
    .interpolate(d3.interpolateHcl);

var projection = d3.geoAlbersUsa()
    .scale(width)
    // .translate([-50, -50])
    .translate([width * 0.5, height * 0.22 ]);

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
        .attr("class", "countries")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .attr("stroke", "#fff")
        .attr("stroke-opacity", 0.1)
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


//construct slider
var data = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];
// Step
var sliderStep = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(1000)
    .tickFormat(d3.format('d'))
    .ticks(9)
    .step(1)
    .default(2010)
    .on('onchange', val => {
        //d3.select('p#value-step').text(d3.format('d')(val));
        var filename = "csv/"+val+"_country_data_utf8.csv";
        d3.queue()
            .defer(d3.json, "js/us.json")
            .defer(d3.csv, filename, function(d) {
                //var droughtRate = (parseFloat(d.D0) + 2 * parseFloat(d.D1) + 3*parseFloat(d.D2) + 4*parseFloat(d.D3) + 5*parseFloat(d.D4) + 1)/1500;
                var unemplyment_rate = parseFloat(d.unemplyment_rate);
                var connected_id = parseInt(d.id + d.county);
                rateById.set(connected_id, unemplyment_rate);
            })
            .await(ready)
    });

var gStep = d3
    .select('div#slider-step')
    .append('svg')
    .attr('width', 1400)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(300,30)');

gStep.call(sliderStep);

//d3.select('p#value-step').text(d3.format('d')(sliderStep.value()));
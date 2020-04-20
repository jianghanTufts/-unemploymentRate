var pageWidth = $("body").width();
var pageHeight = $("body").width()
var svg = d3.select("svg"),
    width = pageWidth * 0.7,
    height = pageHeight * 0.8;

        var margin = {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right:10
                }

        var active = d3.select(null);
        
        var state_map = svg.append("g")




var color1 = d3.scaleLinear()
    .domain([0, 20])
    .range(['#4a69bd', '#181818'])
    .interpolate(d3.interpolateHcl);

var projection = d3.geoAlbersUsa()
    .scale(width)
    .translate([width * 0.5, height * 0.22 ]);

var path = d3.geoPath()
    .projection(projection);

var globalUS;
var countries = new Map();
d3.queue()
     .defer(d3.json, "js/us.json")
    .await(function (error,us) {
        if (error) throw error;
        globalUS = us;
        drawMap();
        buildChart();
    });


function drawMap(year = "2010") {

        
            state_map.append("g")
                .attr("class", "countries")
                .selectAll("path")
                .data(topojson.feature(globalUS, globalUS.objects.counties).features)
                .enter().append("path")
                .attr("d", path)
                .attr("stroke", "#fff")
                .attr("stroke-opacity", 0.1)
                .attr("class",function(d){
                    countries.set(d.id, this);
                    var stateId = parseInt(d.id / 1000);
                    return "county-"+d.id + " state-" + stateId;
                })
                .attr("data-fill",function(d) {
                    return color1(rate_by_year.get(year).get(d.id));
                })
                .style("fill", function(d) {
                    return color1(rate_by_year.get(year).get(d.id));
                })
                .on("click", reset);
            
        state_map.append("g")
                .attr("id", "states")
                .selectAll("path")
                .data(topojson.feature(globalUS, globalUS.objects.states).features)
                .enter().append("path")
                .attr("d", path)
                .style("opacity", 0)
                .on("click", clicked);



        state_map.append("path")
            .datum(topojson.mesh(globalUS, globalUS.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "states_borders")
            .attr("d", path);
}

function changeData(year = "2010"){
    countries.forEach(function (item, key, mapObj) {
        d3.select(item)
            .attr("data-fill",function(d) {
                return color1(rate_by_year.get(year).get(key));
            })
            .style("fill", function(d) {
                return color1(rate_by_year.get(year).get(key));
            });

    });
}

function buildChart() {
    var x_axis = d3.scaleLinear()
        .domain([1, 12])
        .rangeRound([600, 960]);
    var bar = svg.append('g')
        .attr('class', 'key')
        .attr('transform', 'translate(0,40)');
        
    var rgb_arr = [0,3,6,9,12,15,18,21,24];
    var bar_rgb_color = [];
    for (var i = 0; i < 9; i++)
    {
        bar_rgb_color.push(color1(rgb_arr[i]));
    }
    
    var bar_color = d3.scaleThreshold()
        .domain(d3.range(1,88))
        .range(bar_rgb_color);
    
    bar.selectAll('rect')
        .data(bar_color.range().map(function(d) {
            
                d = bar_color.invertExtent(d);
                if (d[0] == null) d[0] = x_axis.domain()[0];
                if (d[1] == null) d[1] = x_axis.domain()[1];
                return d;
            }))
        .enter().append('rect')
            .attr('height', 8)
            .attr('x', function(d) { return x_axis(d[0]); })
            .attr('width', function(d) {return x_axis(d[1]) - x_axis(d[0]); })
            .attr('fill', function(d) { return bar_color(d[0]); });

    var s_ize = [1,2,3,5,7,9];
    bar.append('text')
        .attr('class', 'caption')
        .attr('x', x_axis.range()[0])
        .attr('y', -6)
        .attr('fill', '#000')
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .text('Unempoyment rating');

        bar.call(d3.axisBottom(x_axis)
                .tickSize(13)
                .tickFormat(function(x, i) {
                    var floatNumber = d3.format(".1f");
                    return i == 6 ? '' : i == 0 ? '0.0%' : floatNumber(s_ize[i]/0.45)+'%'; })
                .tickValues(s_ize))
                .select('.domain')
                .remove();
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

function clicked(d) {
    if (d3.select('.background').node() === this) return reset();
    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = 0.5 / Math.max(dx / width, dy / height),
        translate = [width * 0.5 - scale * x, height * 0.22 - scale * y];
        console.log(y);
    state_map.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    
    state_map.append("path")
        .datum(topojson.mesh(globalUS, globalUS.objects.counties, function(a, b) { 
            return  d.id == Math.floor(a.id/1000) && a !== b ; }))
        .transition()
        .duration(750)
        .attr("id", "county-borders")
        .attr("class", "county_borders")
        .attr("d", path);
}

function reset() {
    console.log("reset");
    active.classed("active", false);
    active = d3.select(null);

    state_map.transition()
        .delay(100)
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr('transform', 'translate('+margin.left+','+margin.top+')');
    
    svg.selectAll(".county_borders")
    .transition()
    .delay(100)
    .duration(750)
    .remove();
//	console.log(g.selectAll("#county-borders"));
}


//construct slider
var data = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];
// Step
var sliderStep = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(0.65*width)
    .tickFormat(d3.format('d'))
    .ticks(9)
    .step(1)
    .default(2010)
    .on('onchange', year => {
        //d3.select('p#value-step').text(d3.format('d')(val));
        //drawMap(year);
        changeData(year);
        buildChart();

    });

var gStep = d3
    .select('div#slider-step')
    .append('svg')
    .attr('width', width)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate('+ 0.3*width + ',30)');

gStep.call(sliderStep);

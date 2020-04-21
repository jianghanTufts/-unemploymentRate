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

//the global variable of the chosen state and county
//the value "1" is for testing, it should be set to 0 by default
var chosenStateId = 1;
var chosenCountyId = 1;

var countries = new Map();
d3.queue()
    .defer(d3.json, "js/us.json")
    .await(function (error,us) {
        if (error) throw error;
        globalUS = us;
        drawMap();
        buildChart();
        drawRankingChart("2010", "state");
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
    drawRankingChart(year.toString(), "state");
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

//function handleMouseOverMap(d){
//    var stateId = parseIntd.id;
//    $(".state-"+stateId).css("fill","orange");
//    console.log($(this).data("fill"));
//}
//function handleMouseOutMap(d){
//    var stateId = parseInt(d.id);
//    $(".state-"+stateId).each(function(){
//        $(this).css("fill",$(this).data("fill"));
//    });
//}
//function handleMouseClickMap(d, i){
//    console.log(d);
//    console.log(i);
//}

function clicked(d) {
//    console.log(id_to_countyName);
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
    state_map.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

//    console.log(state_map.selectAll("county_borders"));

    state_map.selectAll(".county_borders")
        .transition()
        .remove();

    state_map.append("path")
        .datum(topojson.mesh(globalUS, globalUS.objects.counties, function(a, b) {
            return  d.id == Math.floor(a.id/1000) && a !== b ; }))
        .transition()
        .duration(750)
        .attr("id", "county-borders")
        .attr("class", "county_borders")
        .attr("d", path)
        .style("stroke", "#e3e3e3")
        .style("stroke-width", ".3px")
    ;

    state_map.selectAll("path")
        .on("mouseover", function (d) {
//                    console.log(path.bounds(d));
//                    console.log(id_to_countyName.get(d.id));

            console.log(path.bounds(d));
            var county_bounds = path.bounds(d),
                county_dx = county_bounds[1][0] - county_bounds[0][0],
                county_dy = county_bounds[1][1] - county_bounds[0][1],
                county_x = (county_bounds[0][0] + county_bounds[1][0]) / 2,
                county_y = (county_bounds[0][1] + county_bounds[1][1]) / 2;
//                    console.log(y);
//                    console.log(d3.event.pageX);
            var rect_width = 0;
            if (id_to_countyName.has(d.id))
            {
                rect_width = id_to_countyName.get(d.id).length;
                state_map.append("rect")
                    .attr("x", county_x+4)
                    .attr("y", county_y-13)
                    .attr("width", rect_width*2)
                    .attr("height", 8)
                    .style("opacity",0.3)
                    .attr("class", "county_label1")
                    .style("fill", "#e3e3e3")
                    .style("stroke", "grey");

                state_map.append("text")
                    .attr("transform", function(d){return "translate("+(county_x+8)+","+(county_y-8)+")"})
                    .text(id_to_countyName.get(d.id))
                    .attr("class", "county_label2")
                    .style("fill", "rgb(203, 214, 0)")
                    .attr("dy", ".35em")
                    .style("font-size", "3.5px");
            }


//                           .style("x", (d3.event.pageX))
//                           .style("y", (d3.event.pageY - 28));

//                    console.log(d);
            if (d.id > 1000)
            {
                $(".county-"+d.id).css("fill","orange");
            }
        })
        .on("mouseout", function (d) {
            state_map.select(".county_label1").remove();
            state_map.select(".county_label2").remove();
            if (d.id > 1000)
            {
                $(this).css("fill",$(this).data("fill"));
            }
        })
//    state_map.selectAll

}

function reset(d) {
//    console.log("reset");
//    console.log(state_map.selectAll("."+d.id));

    active.classed("active", false);
    active = d3.select(null);

    state_map.transition()
        .delay(100)
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr('transform', 'translate('+margin.left+','+margin.top+')');

    state_map.selectAll(".county_borders")
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


//draw chart
var chartWidth = 800;
var chartHeight = 500;
var barHeight = 15;
var yAxisOffset = 150;
var xAxisOffset = 50;
var offsetBetweenBar = 5;
var offsetBetweenBarXAxis = 10;

var format0d = d3.format("02d");

let svg2 = d3.select("#ranking")
    .append('svg')
    .attr('width', chartWidth)
    .attr('height', chartHeight);

function getXScale(objectList, chart_catogary, zoomRate = 1){
    console.log(d3.max(objectList, function(d) {
        if(chart_catogary == "county")
            return d.county_rate;
        else
            return d.state_rate;
    }));
    var scale = d3.scaleLinear()
        .domain([0, zoomRate * d3.max(objectList, function(d) {
            if(chart_catogary == "county")
                return d.county_rate;
            else if(chart_catogary == "state")
                return d.state_rate;
        })])
        .range([0, zoomRate * 0.3*chartWidth]);
    return scale;
}

function getYScale(objectList, chart_catogary){
    var scale = d3.scaleBand()
        .domain(objectList.map(function (d) {
            if(chart_catogary == "county")
                return d.county_name;
            else if(chart_catogary == "state")
                return d.state_name;
        }))
        .range([ offsetBetweenBarXAxis, offsetBetweenBarXAxis+barHeight + (objectList.length-1) * (barHeight+ offsetBetweenBar)]);
    return scale;
}

function drawRankingChart(year, chart_catogary = "state") {
    var objectList;
    if(chart_catogary == "state"){
        objectList = getStateList(year);
    }
    else{
        objectList = getCountyList(year);
    }
    objectList.sort((a,b)=>{
        if(chart_catogary == "county")
            return b.county_rate - a.county_rate;
        else
            return b.state_rate - a.state_rate;
    })
    objectList = objectList.slice(0,20);
    console.log(objectList);
    svg2.selectAll("*").remove();
    var xScale = getXScale(objectList, chart_catogary);
    var xAxisScale = getXScale(objectList, chart_catogary, 1.5);
    var yScale = getYScale(objectList, chart_catogary);

    var yAxis =d3.axisLeft()
        .scale(yScale)
        .tickSize(6);

    var xAxis =d3.axisTop()
        .scale(xAxisScale)
        .tickSize(4)
        .ticks(6)
        .tickFormat(d3.format("0.1f"));

    var bar = svg2.selectAll(".bar")
        .data(objectList)
        .enter().append("g")
        .attr("class", "bar");

    bar.append("rect")
        .attr('fill', '#09c')
        .attr('width', function (d) {
            return 0;
        })
        .attr('height', barHeight)
        .attr('x', yAxisOffset)
        .attr('y', function(d,i){
            return (i) * (barHeight + offsetBetweenBar) + offsetBetweenBarXAxis + xAxisOffset;
        });

    bar.append("text")
        .text(function (d) {
            if(chart_catogary == "county")
                return formatPercent(d.county_rate);
            else
                return formatPercent(d.state_rate);
        })
        .attr('fill', '#000')
        .attr('font-size', "10pt")
        .attr('x', function (d,i) {
            return yAxisOffset+10;
        })
        .attr('y', function (d,i) {
            return i*(barHeight + offsetBetweenBar) + offsetBetweenBarXAxis + 4/5 * barHeight+ xAxisOffset;
        });

    bar.selectAll("rect").transition().duration(1500).attr("width", function(d) {
        if(chart_catogary == "county")
            return xScale(d.county_rate);
        else
            return xScale(d.state_rate);
    });

    bar.selectAll("text").transition().duration(1500)
        .attr("x", function(d) {
            if(chart_catogary == "county")
                return xScale(d.county_rate)+yAxisOffset+10;
            else
                return xScale(d.state_rate)+yAxisOffset+10;
        })
        .text(function (d) {

            if(chart_catogary == "county")
                return d.county_rate + "%";
            else
                return d.state_rate + "%";
        });

    svg2.append("g")
        .attr("class", "axis")
        .call(xAxis)
        .attr("transform", "translate(" + yAxisOffset + "," + xAxisOffset+")");

    svg2.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .attr("transform", "translate(" + yAxisOffset + "," + xAxisOffset+")");

}


function getCountyList(year ) {
    var countyList = [];
    for(item of year_state_county.get(year).get(format0d(chosenStateId))){
        countyList.push(item);
    }
    return countyList;
}

function getStateList(year) {
    var stateList = [];
    year_state_rate.get(parseInt(year)).forEach(function (value, key, map) {
        var tmpstate = new StateObject(key, stateCodesToName[key], value);
        stateList.push(tmpstate);
    });
    return stateList;
}
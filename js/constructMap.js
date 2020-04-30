var pageWidth = $("body").width();
var pageHeight = $(".left-page").height()
var margin = {
    top: 10,
    bottom: 10,
    left: 100,
    right:10
};
var width = pageWidth * 0.65 - margin.left,
    height = pageHeight * 0.8;


var state_map = d3.select("#main-map")
            .append('g')
            .attr('width', width)
            .attr('height', height)
            .attr('transform', 'translate('+margin.left+','+margin.top+')')
            .attr('cx', 100)
            .attr('cy', 800)

console.log(d3.select("#main-map"))


//chart's value
var chartWidth = pageWidth * 0.35 - margin.right;//800
var chartHeight = 500 ;//500
var barHeight = (15/500) *chartHeight ;
var yAxisOffset = 150;
var xAxisOffset = 50;
var offsetBetweenBar = 5;
var offsetBetweenBarXAxis = 10;

var format0d = d3.format("02d");
var barLock = false;

var div = d3.select("#detail_info")
        .attr("class", "tooltip")
        .style("opacity", 0);

let svgRanking = d3.select("#ranking")
        .append('svg')
        .attr('width', chartWidth)
        .attr('height', chartHeight);

let svgChosenCounty = d3.select("#county_select")
        .append('svg')
        .attr('width', chartWidth)
        .attr('height', chartHeight/5);

var countyCart = new Array();
var countyCartColor = d3.map();
var active = d3.select(null);
var currentCountyColor;
//var state_map = svg.append("g")
//                    .attr('width', width+300)
//                    .attr('height', height)


var color1 = d3.scaleLinear()
        .domain([0, 20])
        .range(['#4a69bd', '#181818'])
        .interpolate(d3.interpolateHcl);

var projection = d3.geoAlbersUsa()
        .scale(width*1.12)
        .translate([373,330]);

var path = d3.geoPath()
        .projection(projection);

//global values
var globalUS;
var currentYear = "2010";

//the global variable of the chosen state and county
//the value "1" is for testing, it should be set to 0 by default
var chosenStateId = 0;
var chosenCountyId = 0;
var lastClickedCountyId = -1;
var lastCountyObj;
var clickedOnCounty = false;
var countries = new Map();
d3.queue()
        .defer(d3.json, "js/us.json")
        .await(function (error,us) {
                if (error) throw error;
                globalUS = us;
                drawMap();
                buildPercetageChart();
                drawRankingChart("2010", "state",svgRanking);
                //drawSelectCounty(svgChosenCounty);
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
                .on("click", selectCounty);

        state_map.append("g")
                .attr("id", "states")
                .selectAll("path")
                .data(topojson.feature(globalUS, globalUS.objects.states).features)
                .enter().append("path")
                .attr("d", path)
                .style("opacity", 0)
                .on("click", clickOnState)
                .on("mouseover", mouseOverState)
                .on("mouseout", mouseOutState);


            console.log(state_map.selectAll(".states"));

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
        if(chosenStateId == 0) {
            drawRankingChart(year.toString(), "state", svgRanking);
           // drawSelectCounty(svgChosenCounty);
        }
        else {
            drawRankingChart(year.toString(), "county", svgRanking);
            drawSelectCounty(svgChosenCounty);
        }
}

function buildPercetageChart() {
        var x_axis = d3.scaleLinear()
                .domain([1, 12])
                .rangeRound([600, 960]);
        var bar = d3.select('svg').append('g')
                .attr('class', 'key')
                .attr('transform', 'translate(-130,60)');

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
//                .attr('transform', 'translate(',100,')')
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

function clickOnState(d) {
        console.log("click on state");
        chosenStateId = d.id;
        drawRankingChart(currentYear,"county",svgRanking)
        
        $(".state-"+d.id).each(function()
        {
                $(this).css("fill",$(this).data("fill"));
        });
        

        if (d3.select('.background').node() === this) return resetOnCounty();
        if (active.node() === this) return resetOnCounty();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = 1 / Math.max(dx / width, dy / height),
                translate = [width - scale * x, height - scale * y];
//                translate = [373,330]

        state_map.transition()
                .duration(450)
                .style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

        state_map.selectAll(".county_borders")
                .transition()
                .remove();

        state_map.append("path")
                .datum(topojson.mesh(globalUS, globalUS.objects.counties, function(a, b) {
                        return  d.id == Math.floor(a.id/1000) && a !== b ; }))
                .transition()
                .duration(450)
                .attr("id", "county-borders")
                .attr("class", "county_borders")
                .attr("d", path)
                .style("stroke", "#e3e3e3")
                .style("stroke-width", ".3px")
        ;
        drawCoutyInCart();
        state_map.selectAll("path")
                .on("mouseover", function (d) {
                    clickedOnCounty = false;
                        var county_bounds = path.bounds(d),
                            county_dx = county_bounds[1][0] - county_bounds[0][0],
                            county_dy = county_bounds[1][1] - county_bounds[0][1],
                            county_x = (county_bounds[0][0] + county_bounds[1][0]) / 2,
                            county_y = (county_bounds[0][1] + county_bounds[1][1]) / 2;
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
                        if (d.id > 1000)
                        {
//                            console.log(d3.select(".county-"+d.id).style('fill'));
                            currentCountyColor = d3.select(".county-"+d.id).style('fill');
//                            console.log("mouseover:"+currentCountyColor)

                                chosenCountyId = d.id;
                                drawSelectCounty(svgChosenCounty);

                            
                            $(".county-"+d.id).css("fill","orange");
                        }
                })
                .on("mouseout", function (d) {
                        state_map.select(".county_label1").remove();
                        state_map.select(".county_label2").remove();
                        if (d.id > 1000 && !clickedOnCounty)
                        {
                                $(this).css("fill",currentCountyColor);
                        }
                })
                
        var cancelButton = d3.select("#main-map")
            .append("circle")
            .attr("class", "redButton")
            .style("fill", "red")
            .style("opacity", 0.7)
            .attr("cx", 100)
            .attr("cy", 400)
            .attr("r", 30)
            .on("click", resetOnCounty);
}

// function constructCartArray(id){
//     // countyCart.add(id);
//     line = new Array();
//     for(y = 2010; y < 2019; y++){
//         line.push(year_state_rate.get(y).get(id));
//     }   
//     countyCart.add(new countyYear(id_to_countyName[id], line));
//     console.alert(1);
// }

function countyYear(name, arr){
  this.name = name;
  this.values = arr;
}

function selectCounty(d) {
    clickedOnCounty = true;
     console.log("select county");
     console.log(d3.select(".county-"+d.id).style('fill'));

    if(!countyCartColor.has(d.id) && countyCartColor.size() >= 10){
        alert("Up to ten counties can be compared at the same time!");
    }
    else 
    {
        if (countyCart.includes(d.id))
        {
//            countyCartColor.get(d.id)
            for (var i = 0; i < countyCart.length; i++)
            {
                if (countyCart[i] == d.id)
                {
                    console.log("delete")
                    delete countyCart[i];
                    break;
                }
            }
//            countyCart.delete(d.id);
            $(".county-"+d.id).css("fill",countyCartColor.get(d.id));
            countyCartColor.remove(d.id);
        }
        else 
        {
//            var currentCoutyColor = d3.select(".county-"+d.id).style('fill');
            console.log(currentCountyColor);
            countyCartColor.set(d.id,currentCountyColor)
            $(".county-"+d.id).css("fill","orange");
            countyCart.push(d.id);
        }
        
    }
    console.log("color cart");
    console.log(countyCartColor);
    
    // temp = new Array();
    // line = new Array();

    // let ids = "";
    // let idn = "";
    
    // if(d.id < 10000){
    //     ids = "0" + Math.floor(d.id/1000);
    // } else {
    //     ids = "" + Math.floor(d.id/1000);
    // }
    // // console.log(idn);
    // for(var y = 2010; y < 2019; y++){
    //     var sum = year_state_county.get(y.toString()).get(ids);
    //     for(var i = 0, len = sum.length; i < len; i++){
    //         if(sum[i].county_id === d.id){
    //             temp.push(sum[i].county_rate);
    //             line.push([y, sum[i].county_rate]);
    //             break;
    //         }
    //     }
    // }
    // nameset.push(id_to_countyName["$" + d.id]);
    // countyCart.push(new countyYear(id_to_countyName["$" + d.id], temp));
    // dataset.push(line);

//    if (barLock == false)
//    {
//        lastClickedCountyId = d.id;
//        barLock = true;
//        lastCountyObj = $(this);
//        $(".county-"+d.id).css("fill","orange");
//        
//    }
//    else
//    {
//        if (d.id == lastClickedCountyId)
//        {
//            lastClickedCountyId = -1;
//            barLock = false;
//            console.log($(this));
//            $(this).css("fill",$(this).data("fill"));
//        }
//        else 
//        {
//            lastCountyObj.css("fill",lastCountyObj.data("fill"));
//            $(".county-"+d.id).css("fill","orange");
//            lastCountyObj = $(this);
//            lastClickedCountyId = d.id;
//        }
//    }
    
    chosenCountyId = d.id;
    drawSelectCounty(svgChosenCounty);
    updateBubble();
}

function resetOnCounty(d) {
        
        

        active.classed("active", false);
        active = d3.select(null);

        state_map.transition()
//        .delay(100)
                .duration(450)
                .style("stroke-width", "1.5px")
                .attr('transform', 'translate('+margin.left+','+margin.top+')');

        state_map.selectAll(".county_borders")
                .transition()
//        .delay(100)
                .duration(450)
                .remove();
        d3.select(".redButton")
            .transition()
            .delay(300)
            .duration(300)
            .remove();

        barLock = false;
        chosenCountyId = 0;
        chosenStateId = 0;
        drawRankingChart(currentYear, "state",svgRanking);
        drawSelectCounty(svgChosenCounty);
        updateBubble();
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
                currentYear = year;
                changeData(year);
                buildPercetageChart();
                drawCoutyInCart();

        });

var gStep = d3
        .select('div#slider-step')
        .append('svg')
        .attr('width', width)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate('+ 0.10*width + ',30)');

gStep.call(sliderStep);

$(".slider-button").css("margin-left",0.06*width);
$(".slider-button").click(function() {
    $(".slider-button").removeClass("slider-button-unpressed");
    $(".slider-button").addClass("slider-button-pressed");

    time_travel(currentYear);
});

function time_travel(pos) {
    $(".slider-button").prop("disabled", true);
    setTimeout(function() {
        sliderStep.value(pos);
        if (pos < 2018) {
            time_travel(++pos);
        } else {
            $(".slider-button").prop("disabled", false);
            $(".slider-button").addClass("slider-button-unpressed");
            $(".slider-button").removeClass("slider-button-pressed");
        }
    }, 500);
}

//draw chart


function getXScale(objectList, chart_catogary, zoomRate = 1){
        var maxRate = 0;
        if(chart_catogary == "county")
                maxRate = objectList[0].county_rate;
        else
                maxRate = objectList[0].state_rate;

        // var scale = d3.scaleLinear()
        //     .domain([0, zoomRate * maxRate])
        //     .range([0, zoomRate * 0.3*chartWidth]);
        var scale = d3.scaleLinear()
                .domain([0, 25])
                .range([0, zoomRate * 0.5*chartWidth]);
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

function setTitle(title, text) {
        d3.select(title).text(text)
            .attr("font-size",10);
}



function drawRankingChart(year, chart_catogary = "state", svg2, dataList = [], sliceCount = 20) {
        if(chart_catogary == "county")
                setTitle("#ranking_title", "Unemployment Rate:")
        else
                setTitle("#ranking_title", "Unemployment Rate: USA Top "+ sliceCount.toString());
        var objectList;

        if(dataList.length != 0)
                objectList = dataList;
        else{
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
                objectList = objectList.slice(0,sliceCount);
        }

        svg2.selectAll("*").remove();
        var xScale = getXScale(objectList, chart_catogary);
        var xAxisScale = getXScale(objectList, chart_catogary, 1);
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
                })
                .on("mouseover", function(d) {
                        var name = "";
                        var id;
                        if(chart_catogary == "state"){
                                name = d.state_name;
                                id = d.state_id;
                        }
                        else{
                                name = d.county_name;
                                id = d.county_id;
                        }
                        div.transition()
                                .duration(200)
                                .style("opacity", .9);
                        var rank = getChosenRank(id,chart_catogary);
                        var newHtml = "<p>"+ name +"</p><p>Rank:    "+rank.toString()+"</p>";
                        div.html(newHtml)
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                        div.transition()
                                .duration(500)
                                .style("opacity", 0);
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

        bar.selectAll("rect").transition().duration(500).attr("width", function(d) {
                if(chart_catogary == "county")
                        return xScale(d.county_rate);
                else
                        return xScale(d.state_rate);
        });

        bar.selectAll("text").transition().duration(500)
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

function drawSelectCounty(svg) {
        if(chosenCountyId == 0) {
            setTitle("#chosen_county_title", "");
            svg.selectAll("*").remove();
            return;
        }
        setTitle("#chosen_county_title", id_to_countyName.get(chosenCountyId));
        svg.selectAll("*").remove();
        var countyList = getChosenCounty(currentYear, chosenCountyId);
        drawRankingChart(currentYear,"county",svg,countyList)
}

function getCountyList(year) {
        var countyList = [];
        for(item of year_state_county.get(year.toString()).get(format0d(chosenStateId))){
                countyList.push(item);
        }
        return countyList;
}

function getChosenCounty(year, countyID) {
        var countyList = [];
        for(item of year_state_county.get(year.toString()).get(format0d(chosenStateId))){
                if(item.county_id == countyID) {
                        countyList.push(item);
                        break;
                }
        }
        return countyList;
}
function getChosenRank(id, catogary = "state") {
        var tmplist;
        var rank = 0;
        if(catogary == "county") {
                tmplist = getCountyList(currentYear);
        }
        else{
                tmplist = getStateList(currentYear);
        }
        tmplist.sort((a,b)=>{
                if(catogary == "county")
                        return b.county_rate - a.county_rate;
                else
                        return b.state_rate - a.state_rate;
        })
        for(var i=0;i<tmplist.length;i++)
        {
                if(catogary == "county") {
                        if(tmplist[i].county_id == id)
                        {
                                rank = i;
                                break;
                        }
                }
                else{
                        if(tmplist[i].state_id == id)
                        {
                                rank = i;
                                break;
                        }
                }
        }
        return rank+1;
}
function getStateList(year) {
        var stateList = [];
        year_state_rate.get(parseInt(year)).forEach(function (value, key, map) {
                var tmpstate = new StateObject(key, stateCodesToName[key], value);
                stateList.push(tmpstate);
        });
        return stateList;
}

function mouseOverState(d){
    $(".state-"+d.id).css("fill","orange");
 }
function mouseOutState(d) {
    $(".state-" + d.id).each(function () {
        $(this).css("fill", $(this).data("fill"));
    });
}
function updateBubble(){
    var l = countyCartColor.size();
//    console.log("bubble:"+countyCartColor.size())
    $("#num_states").html(l);
    if(l<1){
        $("#num_states").css("opacity",0);
    }else{
        $("#num_states").css("opacity",1);
    }
}

function drawCoutyInCart(){
    console.log("?????????????")
    console.log(countyCartColor)
    
    selectedConties = countyCartColor.keys();
    for (var i = 0; i < selectedConties.length; i++)
    {
        console.log(selectedConties[i]);
        $(".county-"+selectedConties[i]).css("fill",'orange');
    }
}

$('#exampleModal').on('show.bs.modal', function (e) {
    console.log("call draw line chart");
    drawLineChart();
})
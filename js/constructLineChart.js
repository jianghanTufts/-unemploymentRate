const line_chart = d3.select("#line-chart")
    .append("svg")
    .attr('width', "70%")
    .attr('height', "70%")
    .attr("viewBox", [0, 0, 400, 400])
    .style("overflow", "visible");
const legend_chart = d3.select("#line-dashboard")
    .append("svg")
    .attr('width', "100%")
    .attr('height', "100%")
    .style("overflow", "visible");

// 图表的宽度和高度
var width = 400;
var height = 400;

// 预留给轴线的距离
var padding = { top: 50, right: 50, bottom: 50, left: 50 };

var line_color = d3.scaleOrdinal(d3.schemeCategory10);
var curPos = -1;

function drawWelcomeText(){

    let welcomeText = line_chart
        .append('g')
        .append('text')
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle");

    welcomeText
        .html("No county selected, please select the county first!")
        .attr("x", width/2)
        .attr("y", height/5*2)
        .attr("font-family", "sans-serif")
        .attr("font-size", 16)
        .attr("text-anchor", "middle")
}

$(".legend-trash").on("click",function(){
    var idArray = countyCartColor.keys();
    for(var d_id in idArray)  {
        $(".county-"+idArray[d_id]).css("fill",countyCartColor.get(idArray[d_id]));
        countyCartColor.remove(idArray[d_id]);
    };
    $(".legend-trash").css("opacity",0);
    line_chart.selectAll("*").remove();
    legend_chart.selectAll("*").remove();
    drawWelcomeText();
    updateBubble();
});

function drawLineChart() {


    let yxAxis = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"]


    if (countyCartColor.keys().length < 1) {
        line_chart.selectAll("*").remove();
        legend_chart.selectAll("*").remove();
        $(".legend-trash").css("opacity",0);
        drawWelcomeText();
        return;
    }

    $(".legend-trash").css("opacity",1);
    // pre-process data

    let dataset = new Array();
    let nameset = new Array();
    var idset = new Array();

    let idArray = countyCartColor.keys();


    for (var k = idArray.length - 1; k >= 0; k--) {

        let temp = new Array();
        let line = new Array();

        let ids = "";
        // let idn = "";
        let currId = parseInt(idArray[k]);

        if (currId < 10000) {
            ids = "0" + Math.floor(currId / 1000);
        } else {
            ids = "" + Math.floor(currId / 1000);
        }

        for (var y = 2010; y < 2019; y++) {
            sum = year_state_county.get(y.toString()).get(ids);
            // console.log("sum: " + sum);
            for (var q = 0, len = sum.length; q < len; q++) {
                if (sum[q].county_id === currId) {
                    temp.push(sum[q].county_rate);
                    line.push([y, sum[q].county_rate]);
                    break;
                }
            }
        }
        nameset.push(id_to_countyName["$" + currId]);
        dataset.push(line);

    }
    line_chart.selectAll("*").remove();
    legend_chart.selectAll("*").remove();

    var min = d3.min(dataset, function(d) {
        return d3.min(d, function(dd){return dd[1]});
    })
    var max = d3.max(dataset, function(d) {
        return d3.max(d, function(dd){return dd[1]});
    })



    var xScale = d3.scaleLinear()
        .domain([2010, 2018])
        .range([0, width - padding.left - padding.right]);

    var yScale = d3.scaleLinear()
        .domain([0, max+1])
        .range([height - padding.top - padding.bottom, 0]);

    var xAxis = d3.axisBottom()
        .tickFormat(d3.format("d"))
        .scale(xScale);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    var focus = line_chart
        .append('g')
        .append('line')
        .style("opacity", 0)
        .attr("x1", -100)
        .attr("x2", -100)
        .attr("y1", padding.top)
        .attr("y2", yScale(0)+padding.top)
        .attr("stroke-width", 1)
        .attr("stroke", "orange");

    line_chart.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
        .call(xAxis);

    line_chart.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        .call(yAxis);
    for (var i = dataset.length - 1; i >= 0; i--) {

        var linePath = d3.line()
            .x(function(d){ return xScale(d[0]) })
            .y(function(d){ return yScale(d[1]) });

        line_chart.append('g')
            .append('path')
            .attr('class', 'line-path')
            .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
            .attr('d', linePath(dataset[i]))
            .attr('fill', 'none')
            .attr("data-setpos",i)
            // .attr('id', idp++)
            .attr('stroke-width', 1)
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("stroke", function(){
                return line_color(i);
            });


        line_chart.append('g')
            .selectAll('circle')
            .data(dataset[i])
            .enter()
            .append('circle')
            .attr('r', 1.5)
            .attr("stroke", function(){
                return line_color(i);
            })
            // .attr('id', idc++)
            .attr('transform', function(d){
                return 'translate(' + (xScale(d[0]) + padding.left) + ',' + (yScale(d[1]) + padding.top) + ')'
            });


        legend_chart.append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .classed("legend-rect",true)
            .classed("legend-data-"+i,true)
            .attr("data-setpos",i)
            .attr('width', "10px")
            .attr('height', "10px")
            .attr('transform', 'translate(' + 10 + ',' + 40 * (i+3) + ')')
            .style("fill", function(){
                return line_color(i);
            })
            .on('mouseenter', function(){

            })
            .on('mouseout', function(){

            })
            .on("click",function(){
                var d_id = idArray[$(this).data("setpos")]
                $(".county-"+d_id).css("fill",countyCartColor.get(d_id));
                countyCartColor.remove(d_id);
                drawLineChart();
                updateBubble();
            });
        legend_chart.append('text')
            .attr("text-anchor", "left")
            .attr("font-size","12px")
            .attr("data-setpos",i)
            .attr("alignment-baseline", "middle")
            .classed("legend-data-"+i,true)
            .html(function(){
                return nameset[i] + "&nbsp;&nbsp;" + dataset[i][0][1] + "%";
            })
            .attr('transform', 'translate(' + 30 + ',' + (40 * (i+3) + 8)  + ')');

    }
    line_chart
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', function(){

            d3.select("#line-chart").selectAll('path').attr('opacity', 0.5);
            d3.select("#line-chart").selectAll('circle').attr('opacity', 0.5);

            if(dataset.length >= 1){
                focus.style("opacity", 1)
            }
        })
        .on('mousemove', function(){
            var x0 = xScale.invert(d3.mouse(this)[0]);
            var i = parseInt(x0 - 1);
            // var curPos = i;
            if(i<2010 || i>2018){
                return;
            }
            var selectedPos = dataset[0][i-2010];
            var selectedData = new Array();
            for(var j = 0; j < dataset.length; j++){
                selectedData.push(dataset[j][i-2010][1]);
            }
            var posset = new Array();
            for(let x = 0; x < dataset.length; x++){
                var count = 0;
                selectedData.forEach(function(element){
                    if(element>=selectedData[x]){
                        count++;
                    }
                });
                if(posset.indexOf(count)>-1){
                    count--;
                }
                posset.push(count);
            }
            console.log(posset);

            if(i<2010 || i>2018){
                return;
            }
            focus.attr("x1",xScale(selectedPos[0])+50)
                .attr("x2",xScale(selectedPos[0])+50);
            legend_chart.selectAll('text')
                .html(function(){
                    var pos = $(this).data("setpos");
                    return nameset[pos] + "&nbsp;&nbsp;" + dataset[pos][i-2010][1] + "%";
                })
                .transition()
                .attr('transform', function(){
                    var pos = $(this).data("setpos");
                    return 'translate(' + 30 + ',' + (40 * (posset[pos] + 2) + 8)  + ')';
                });
            legend_chart.selectAll('rect')
                .transition()
                .attr('transform', function(){
                    var pos = $(this).data("setpos");
                    return 'translate(' + 10 + ',' + 40 * (posset[pos] + 2)  + ')';
                });
        })
        .on('mouseout', function(){

            d3.select("#line-chart").selectAll('path').attr('opacity', 1);
            d3.select("#line-chart").selectAll('circle').attr('opacity', 1);

            if(dataset.length >= 1){
                focus.style("opacity", 0);
            }
        });

}
const line_chart = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", [0, 0, 400, 400])
        .style("overflow", "visible");

// 图表的宽度和高度
var width = 400;
var height = 400;
// 预留给轴线的距离
var padding = { top: 50, right: 50, bottom: 50, left: 50 };

const yxAxis = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]

// var dataset1 = [[1, 224], [2, 528], [3, 756], [4, 632], [5, 582], [6, 704], [7, 766], [8, 804], [9, 884], [10, 960], [11, 1095], [12, 1250]];
// var dataset2 = [[1, 200], [2, 528], [3, 756], [4, 632], [5, 582], [6, 704], [7, 766], [8, 804], [9, 884], [10, 960], [11, 1095], [12, 1250]];

dataset = new Array();
nameset = new Array();

// // class data = {
// //   const columns = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]
// //   return {
// //     y: "% Unemployment",
// //     series: countyCart.map(d => ({
// //       name: d.name,
// //       values: d.values
// //     })),
// //     dates: columns.map(d3.utcParse("%Y"))
// //   };
// // }

// function Data(){

//   this.y = "% Unemployment";
//   this.series = countyCart;
//   const columns = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]
//   // for (var i = columns.length - 1; i >= 0; i--) {
//   //   columns[i]
//   // }
//   this.dates = columns.map(d3.utcParse("%Y"));
// }

// data = new Data();

drawLineChart();

let idc = 0;
let idp = 0;

function drawLineChart(){
  
  line_chart.selectAll("*").remove();

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
                  .domain([0, max])
                  .range([height - padding.top - padding.bottom, 0]);

  // var svg = d3.select('body')
  //             .append('svg')
  //             .attr('width', width + 'px')
  //             .attr('height', height + 'px');

  var xAxis = d3.axisBottom()
                .scale(xScale);

  var yAxis = d3.axisLeft()
                .scale(yScale);

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
      .attr('id', idp++)
      .attr('stroke-width', 1)
      .attr('stroke', 'green')
      .on("mouseover", function (d) {
        line_chart.append("text")
        .text(nameset[i])
        .attr('fill', '#000')
        .attr('font-size', "10pt")
        .attr('x', 50)
        .attr('y', 50);

      })
      .on("mouseout", function (d) {
        
      });


    line_chart.append('g')
      .selectAll('circle')
      .data(dataset[i])
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('id', idc++)
      .attr('transform', function(d){
        return 'translate(' + (xScale(d[0]) + padding.left) + ',' + (yScale(d[1]) + padding.top) + ')'
      })
      .attr('fill', 'green')
      .on("mouseover", function (d) {
          // body...
      })
      .on("mouseout", function (d) {
          // body...
      });

  }
}


// // d3 = require("d3@5", "d3-array@2")

// const line_chart = d3.select("#line-chart")
//         .append("svg")
//         .attr("viewBox", [0, 0, 400, 400])
//         .style("overflow", "visible");

// margin = ({top: 20, right: 20, bottom: 30, left: 30})

// height = 600

// // class data = {
// //   const columns = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]
// //   return {
// //     y: "% Unemployment",
// //     series: countyCart.map(d => ({
// //       name: d.name,
// //       values: d.values
// //     })),
// //     dates: columns.map(d3.utcParse("%Y"))
// //   };
// // }

// function Data(){

//   this.y = "% Unemployment";
//   this.series = countyCart;
//   const columns = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]
//   // for (var i = columns.length - 1; i >= 0; i--) {
//   //   columns[i]
//   // }
//   this.dates = columns.map(d3.utcParse("%Y"));
// }

// data = new Data();

// x = d3.scaleUtc()
//     .domain(d3.extent(data.dates))
//     .range([margin.left, width - margin.right])

// y = d3.scaleLinear()
//     .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
//     .range([height - margin.bottom, margin.top])

// xAxis = g => g
//     .attr("transform", `translate(0,${height - margin.bottom})`)
//     .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

// yAxis = g => g
//     .attr("transform", 'translate(${margin.left},0)')
//     .call(d3.axisLeft(y))
//     .call(g => g.select(".domain").remove())
//     .call(g => g.select(".tick:last-of-type text").clone()
//         .attr("x", 3)
//         .attr("text-anchor", "start")
//         .attr("font-weight", "bold")
//         .text(data.y))

// line_chart.append("g")
//     .call(xAxis);

// line_chart.append("g")
//     .call(yAxis);

// // const path_lc = line_chart.append("g")
// //     .attr("fill", "none")
// //     .attr("stroke", "steelblue")
// //     .attr("stroke-width", 1.5)
// //     .attr("stroke-linejoin", "round")
// //     .attr("stroke-linecap", "round")
// //     .selectAll("path")
// //     .data(data.series)
// //     .join("path")
// //     .style("mix-blend-mode", "multiply")
// //     .attr("d", d => line(d.values));

// // line_chart.call(hover);

// // function hover(svg, path) {
  
// //   if ("ontouchstart" in document) line_chart
// //       .style("-webkit-tap-highlight-color", "transparent")
// //       .on("touchmove", moved)
// //       .on("touchstart", entered)
// //       .on("touchend", left)
// //   else svg
// //       .on("mousemove", moved)
// //       .on("mouseenter", entered)
// //       .on("mouseleave", left);

// //   const dot = line_chart.append("g")
// //       .attr("display", "none");

// //   dot.append("circle")
// //       .attr("r", 2.5);

// //   dot.append("text")
// //       .attr("font-family", "sans-serif")
// //       .attr("font-size", 10)
// //       .attr("text-anchor", "middle")
// //       .attr("y", -8);

// //   function moved() {
// //     d3.event.preventDefault();
// //     const ym = y.invert(d3.event.layerY);
// //     const xm = x.invert(d3.event.layerX);
// //     const i1 = d3.bisectLeft(data.dates, xm, 1);
// //     const i0 = i1 - 1;
// //     const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
// //     const s = d3.least(data.series, d => Math.abs(d.values[i] - ym));
// //     path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
// //     dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
// //     dot.select("text").text(s.name);
// //   }

// //   function entered() {
// //     path_lc.style("mix-blend-mode", null).attr("stroke", "#ddd");
// //     dot.attr("display", null);
// //   }

// //   function left() {
// //     path_lc.style("mix-blend-mode", "multiply").attr("stroke", null);
// //     dot.attr("display", "none");
// //   }
// // }

// // line = d3.line()
// //     .defined(d => !isNaN(d))
// //     .x((d, i) => x(data.dates[i]))
// //     .y(d => y(d))

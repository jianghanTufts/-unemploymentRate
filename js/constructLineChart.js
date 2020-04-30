const line_chart = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", [0, 0, 400, 400])
        .style("overflow", "visible");

// 图表的宽度和高度
var width = 400;
var height = 400;

// 预留给轴线的距离
var padding = { top: 50, right: 50, bottom: 50, left: 50 };

// var dataset1 = [[1, 224], [2, 528], [3, 756], [4, 632], [5, 582], [6, 704], [7, 766], [8, 804], [9, 884], [10, 960], [11, 1095], [12, 1250]];
// var dataset2 = [[1, 200], [2, 528], [3, 756], [4, 632], [5, 582], [6, 704], [7, 766], [8, 804], [9, 884], [10, 960], [11, 1095], [12, 1250]];

// dataset = new Array();
// nameset = new Array();

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
  // const columns = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]
//   // for (var i = columns.length - 1; i >= 0; i--) {
//   //   columns[i]
//   // }
//   this.dates = columns.map(d3.utcParse("%Y"));
// }

// data = new Data();

// drawLineChart();

// remind words

// let sum;
// let ids = "";
// var dataset = new Array();
// var nameset = new Array();

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

// let idc = 0;
// let idp = 0;

// let idArray;

function drawLineChart(){


  let yxAxis = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"]


  if(countyCartColor.keys().length < 1){
  	line_chart.selectAll("*").remove();
    drawWelcomeText();
    return;
  }

  let offset = 5;
  let fontSize = 8;
  let shrinkRate = 1;

  // pre-process data

  let dataset = new Array();
  let nameset = new Array();

  let idArray = countyCartColor.keys();


  for (var k = idArray.length - 1; k >= 0; k--) {

    let temp = new Array();
    let line = new Array();

    let ids = "";
    // let idn = "";
    let currId = parseInt(idArray[k]);

    if(currId < 10000){
        ids = "0" + Math.floor(currId/1000);
    } else {
        ids = "" + Math.floor(currId/1000);
    }

    // console.log("ids: " + ids);
    // console.log(countyCart);

    // console.log(ids);
    // console.log(idn);

    for(var y = 2010; y < 2019; y++){
        sum = year_state_county.get(y.toString()).get(ids);
        // console.log("sum: " + sum);
        for(var q = 0, len = sum.length; q < len; q++){
            if(sum[q].county_id === currId){
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

  // var svg = d3.select('body')
  //             .append('svg')
  //             .attr('width', width + 'px')
  //             .attr('height', height + 'px');

  var xAxis = d3.axisBottom()
                .scale(xScale);

  // var yAxis = d3.axisLeft()
  //               .scale(yScale);
  var yAxis = g => g
    .call(d3.axisLeft(yScale))
    .call(g => g.select(".domain").remove())
  // var focus = line_chart
  //     .append('g')
  //     .append('circle')
  //     .style("fill", "none")
  //     .attr("stroke", "black")
  //     .attr('r', 8.5)
  //     .style("opacity", 0);

  var focus = line_chart
          .append('g')
          .append('line')
          .style("opacity", 0)
          .attr("stroke-width", 1)
          .attr("stroke", "orange");

  var focusText1 = line_chart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

  var focusText2 = line_chart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

  var focusText3 = line_chart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

  var focusText4 = line_chart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

  var focusText5 = line_chart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

  var focusText6 = line_chart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

  var focusText7 = line_chart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

  var focusText8 = line_chart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

  var focusText9 = line_chart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

  var focusText10 = line_chart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

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
      // .attr('id', idp++)
      .attr('stroke-width', 1)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("stroke", "green");
      // .on("mouseover", function (d) {
      //   line_chart.append("text")
      //   .text(nameset[i])
      //   .attr('fill', '#000')
      //   .attr('font-size', "10pt")
      //   .attr('x', 50)
      //   .attr('y', 50);
      // })
      // .on("mouseout", function (d) {
      // });


    line_chart.append('g')
      .selectAll('circle')
      .data(dataset[i])
      .enter()
      .append('circle')
      .attr('r', 1.5)
      .attr("stroke", "green")
      // .attr('id', idc++)
      .attr('transform', function(d){
        return 'translate(' + (xScale(d[0]) + padding.left) + ',' + (yScale(d[1]) + padding.top) + ')'
      });

  }
   
  var bisect = d3.bisector(function(d) { return d.x; }).left;
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
          focusText1.style("opacity",1)
          shrinkRate = shrinkRate * shrinkRate;
        }
        if(dataset.length >= 2){
          focusText2.style("opacity",1)
          shrinkRate = shrinkRate * shrinkRate;
        }
        if(dataset.length >= 3){
          focusText3.style("opacity",1)
          shrinkRate = shrinkRate * shrinkRate;
        }
        if(dataset.length >= 4){
          focusText4.style("opacity",1)
          shrinkRate = shrinkRate * shrinkRate;
        }
        if(dataset.length >= 5){
          focusText5.style("opacity",1)
          shrinkRate = shrinkRate * shrinkRate;
        }
        if(dataset.length >= 6){
          focusText6.style("opacity",1)
          shrinkRate = shrinkRate * shrinkRate;
        }
        if(dataset.length >= 7){
          focusText7.style("opacity",1)
          shrinkRate = shrinkRate * shrinkRate;
        }
        if(dataset.length >= 8){
          focusText8.style("opacity",1)
          shrinkRate = shrinkRate * shrinkRate;
        }
        if(dataset.length >= 9){
          focusText9.style("opacity",1)
          shrinkRate = shrinkRate * shrinkRate;
        }
        if(dataset.length >= 10){
          focusText10.style("opacity",1)
          shrinkRate = shrinkRate * shrinkRate;
        }
      })
      .on('mousemove', function(){

          var x0 = xScale.invert(d3.mouse(this)[0]);

          // console.log(x0);
          var i = parseInt(x0 - 1);
          if(i<2010 || i>2018){

            if(dataset.length >= 1){
              focus
                  .attr("x1", -1000)
                  .attr("y1", -1000)
                  .attr("x2", -1000)
                  .attr("y2", 1000)
              focusText1
                  .attr("x", -100)
                  .attr("y", -100)
            }


            if(dataset.length >= 2){
              focusText2
                  .attr("x", -100)
                  .attr("y", -100)
            }
            if(dataset.length >= 3){
              focusText3
                  .attr("x", -100)
                  .attr("y", -100)
            }
            if(dataset.length >= 4){
              focusText4
                  .attr("x", -100)
                  .attr("y", -100)
            }

            if(dataset.length >= 5){
              focusText5
                  .attr("x", -100)
                  .attr("y", -100)
            }

            if(dataset.length >= 6){
              focusText6
                  .attr("x", -100)
                  .attr("y", -100)
            }

            if(dataset.length >= 7){
              focusText7
                  .attr("x", -100)
                  .attr("y", -100)
            }

            if(dataset.length >= 8){
              focusText8
                  .attr("x", -100)
                  .attr("y", -100)
            }

            if(dataset.length >= 9){
              focusText9
                  .attr("x", -100)
                  .attr("y", -100)
            }

            if(dataset.length >= 10){
              focusText10
                  .attr("x", -100)
                  .attr("y", -100)
            }

            return;
          }

          var lmin = Number.MAX_VALUE;
          var lmax = Number.MIN_VALUE;

          if(dataset.length >= 1){
          
            selectedData = dataset[0][i-2010]

            if(lmax < yScale(selectedData[1])+80){
              lmax = yScale(selectedData[1])+80;
            }
            if(lmin > yScale(selectedData[1])+20){
              lmin = yScale(selectedData[1])+20;
            }

            focus
                .attr("x1", xScale(selectedData[0])+50)
                .attr("x2", xScale(selectedData[0])+50)
                .attr("y1", lmin)
                .attr("y2", lmax)

            selectedData = dataset[0][i-2010];
            focusText1
                .html(nameset[0] + ": " + selectedData[1])
                .attr("x", xScale(selectedData[0])+50)
                .attr("y", yScale(selectedData[1])+50-4*offset)
                .attr("font-family", "sans-serif")
                .attr("font-size", Math.floor(fontSize * shrinkRate))
                .attr("text-anchor", "middle")
          }

          if(dataset.length >= 2){
            selectedData = dataset[1][i-2010]

            if(lmax < yScale(selectedData[1])+80){
              lmax = yScale(selectedData[1])+80;
            }
            if(lmin > yScale(selectedData[1])+20){
              lmin = yScale(selectedData[1])+20;
            }

            focus
                .attr("x1", xScale(selectedData[0])+50)
                .attr("x2", xScale(selectedData[0])+50)
                .attr("y1", lmin)
                .attr("y2", lmax)
            
            focusText2
                .html(nameset[1] + ": " + selectedData[1])
                .attr("x", xScale(selectedData[0])+50)
                .attr("y", yScale(selectedData[1])+50-3*offset)
                .attr("font-family", "sans-serif")
                .attr("font-size", Math.floor(fontSize * shrinkRate))
                .attr("text-anchor", "middle")
          }

          if(dataset.length >= 3){
            selectedData = dataset[2][i-2010]

            if(lmax < yScale(selectedData[1])+80){
              lmax = yScale(selectedData[1])+80;
            }
            if(lmin > yScale(selectedData[1])+20){
              lmin = yScale(selectedData[1])+20;
            }

            focus
                .attr("x1", xScale(selectedData[0])+50)
                .attr("x2", xScale(selectedData[0])+50)
                .attr("y1", lmin)
                .attr("y2", lmax)
            
            focusText3
                .html(nameset[2] + ": " + selectedData[1])
                .attr("x", xScale(selectedData[0])+50)
                .attr("y", yScale(selectedData[1])+50-2*offset)
                .attr("font-family", "sans-serif")
                .attr("font-size", Math.floor(fontSize * shrinkRate))
                .attr("text-anchor", "middle")
          }

          if(dataset.length >= 4){
            selectedData = dataset[3][i-2010]

            if(lmax < yScale(selectedData[1])+80){
              lmax = yScale(selectedData[1])+80;
            }
            if(lmin > yScale(selectedData[1])+20){
              lmin = yScale(selectedData[1])+20;
            }

            focus
                .attr("x1", xScale(selectedData[0])+50)
                .attr("x2", xScale(selectedData[0])+50)
                .attr("y1", lmin)
                .attr("y2", lmax)
            
            focusText4
                .html(nameset[3] + ": " + selectedData[1])
                .attr("x", xScale(selectedData[0])+50)
                .attr("y", yScale(selectedData[1])+50-1*offset)
                .attr("font-family", "sans-serif")
                .attr("font-size", Math.floor(fontSize * shrinkRate))
                .attr("text-anchor", "middle")
          }

          if(dataset.length >= 5){
            selectedData = dataset[4][i-2010]

            if(lmax < yScale(selectedData[1])+80){
              lmax = yScale(selectedData[1])+80;
            }
            if(lmin > yScale(selectedData[1])+20){
              lmin = yScale(selectedData[1])+20;
            }

            focus
                .attr("x1", xScale(selectedData[0])+50)
                .attr("x2", xScale(selectedData[0])+50)
                .attr("y1", lmin)
                .attr("y2", lmax)
            
            focusText5
                .html(nameset[4] + ": " + selectedData[1])
                .attr("x", xScale(selectedData[0])+50)
                .attr("y", yScale(selectedData[1])+50+0*offset)
                .attr("font-family", "sans-serif")
                .attr("font-size", Math.floor(fontSize * shrinkRate))
                .attr("text-anchor", "middle")
          }

          if(dataset.length >= 6){
            selectedData = dataset[5][i-2010]

            if(lmax < yScale(selectedData[1])+80){
              lmax = yScale(selectedData[1])+80;
            }
            if(lmin > yScale(selectedData[1])+20){
              lmin = yScale(selectedData[1])+20;
            }

            focus
                .attr("x1", xScale(selectedData[0])+50)
                .attr("x2", xScale(selectedData[0])+50)
                .attr("y1", lmin)
                .attr("y2", lmax)
            
            focusText6
                .html(nameset[5] + ": " + selectedData[1])
                .attr("x", xScale(selectedData[0])+50)
                .attr("y", yScale(selectedData[1])+50+1*offset)
                .attr("font-family", "sans-serif")
                .attr("font-size", Math.floor(fontSize * shrinkRate))
                .attr("text-anchor", "middle")
          }

          if(dataset.length >= 7){
            selectedData = dataset[6][i-2010]

            if(lmax < yScale(selectedData[1])+80){
              lmax = yScale(selectedData[1])+80;
            }
            if(lmin > yScale(selectedData[1])+20){
              lmin = yScale(selectedData[1])+20;
            }

            focus
                .attr("x1", xScale(selectedData[0])+50)
                .attr("x2", xScale(selectedData[0])+50)
                .attr("y1", lmin)
                .attr("y2", lmax)
            
            focusText7
                .html(nameset[6] + ": " + selectedData[1])
                .attr("x", xScale(selectedData[0])+50)
                .attr("y", yScale(selectedData[1])+50+2*offset)
                .attr("font-family", "sans-serif")
                .attr("font-size", Math.floor(fontSize * shrinkRate))
                .attr("text-anchor", "middle")
          }

          if(dataset.length >= 8){
            selectedData = dataset[7][i-2010]

            if(lmax < yScale(selectedData[1])+80){
              lmax = yScale(selectedData[1])+80;
            }
            if(lmin > yScale(selectedData[1])+20){
              lmin = yScale(selectedData[1])+20;
            }

            focus
                .attr("x1", xScale(selectedData[0])+50)
                .attr("x2", xScale(selectedData[0])+50)
                .attr("y1", lmin)
                .attr("y2", lmax)
            
            focusText8
                .html(nameset[7] + ": " + selectedData[1])
                .attr("x", xScale(selectedData[0])+50)
                .attr("y", yScale(selectedData[1])+50+3*offset)
                .attr("font-family", "sans-serif")
                .attr("font-size", Math.floor(fontSize * shrinkRate))
                .attr("text-anchor", "middle")
          }

          if(dataset.length >= 9){
            selectedData = dataset[8][i-2010]

            if(lmax < yScale(selectedData[1])+80){
              lmax = yScale(selectedData[1])+80;
            }
            if(lmin > yScale(selectedData[1])+20){
              lmin = yScale(selectedData[1])+20;
            }

            focus
                .attr("x1", xScale(selectedData[0])+50)
                .attr("x2", xScale(selectedData[0])+50)
                .attr("y1", lmin)
                .attr("y2", lmax)
            
            focusText9
                .html(nameset[8] + ": " + selectedData[1])
                .attr("x", xScale(selectedData[0])+50)
                .attr("y", yScale(selectedData[1])+50+4*offset)
                .attr("font-family", "sans-serif")
                .attr("font-size", Math.floor(fontSize * shrinkRate))
                .attr("text-anchor", "middle")
          }

          if(dataset.length >= 10){
            selectedData = dataset[9][i-2010]

            if(lmax < yScale(selectedData[1])+80){
              lmax = yScale(selectedData[1])+80;
            }
            if(lmin > yScale(selectedData[1])+20){
              lmin = yScale(selectedData[1])+20;
            }

            focus
                .attr("x1", xScale(selectedData[0])+50)
                .attr("x2", xScale(selectedData[0])+50)
                .attr("y1", lmin)
                .attr("y2", lmax)
            
            focusText10
                .html(nameset[9] + ": " + selectedData[1])
                .attr("x", xScale(selectedData[0])+50)
                .attr("y", yScale(selectedData[1])+50+5*offset)
                .attr("font-family", "sans-serif")
                .attr("font-size", Math.floor(fontSize * shrinkRate))
                .attr("text-anchor", "middle")
          }


      })
      .on('mouseout', function(){

        d3.select("#line-chart").selectAll('path').attr('opacity', 1);
        d3.select("#line-chart").selectAll('circle').attr('opacity', 1);

        if(dataset.length >= 1){
          focus.style("opacity", 0)
          focusText1.style("opacity", 0)
        }
        if(dataset.length >= 2){
          focusText2.style("opacity", 0)
        }
        if(dataset.length >= 3){
          focusText3.style("opacity", 0)
        }
        if(dataset.length >= 4){
          focusText4.style("opacity", 0)
        }
        if(dataset.length >= 5){
          focusText5.style("opacity", 0)
        }
        if(dataset.length >= 6){
          focusText6.style("opacity", 0)
        }
        if(dataset.length >= 7){
          focusText7.style("opacity", 0)
        }
        if(dataset.length >= 8){
          focusText8.style("opacity", 0)
        }
        if(dataset.length >= 9){
          focusText9.style("opacity", 0)
        }
        if(dataset.length >= 10){
          focusText10.style("opacity", 0)
        }
      });

    // }

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

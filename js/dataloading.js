var rate_by_year = d3.map();
d3.queue()
    .defer(d3.csv, "csv/2010_country_data_utf8.csv", function(d) {
        //var droughtRate = (parseFloat(d.D0) + 2 * parseFloat(d.D1) + 3*parseFloat(d.D2) + 4*parseFloat(d.D3) + 5*parseFloat(d.D4) + 1)/1500;
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        if(rate_by_year.has("2010")){
            rate_by_year.get("2010").set(connected_id, unemplyment_rate);
        }
        else {
            var rateById = d3.map();
            rateById.set(connected_id, unemplyment_rate);
            rate_by_year.set("2010", rateById);
        }
    })
    .defer(d3.csv, "csv/2011_country_data_utf8.csv", function(d) {
        //var droughtRate = (parseFloat(d.D0) + 2 * parseFloat(d.D1) + 3*parseFloat(d.D2) + 4*parseFloat(d.D3) + 5*parseFloat(d.D4) + 1)/1500;
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        if(rate_by_year.has("2011")){
            rate_by_year.get("2011").set(connected_id, unemplyment_rate);
        }
        else {
            var rateById = d3.map();
            rateById.set(connected_id, unemplyment_rate);
            rate_by_year.set("2011", rateById);
        }
    })
    .defer(d3.csv, "csv/2012_country_data_utf8.csv", function(d) {
        //var droughtRate = (parseFloat(d.D0) + 2 * parseFloat(d.D1) + 3*parseFloat(d.D2) + 4*parseFloat(d.D3) + 5*parseFloat(d.D4) + 1)/1500;
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        if(rate_by_year.has("2012")){
            rate_by_year.get("2012").set(connected_id, unemplyment_rate);
        }
        else {
            var rateById = d3.map();
            rateById.set(connected_id, unemplyment_rate);
            rate_by_year.set("2012", rateById);
        }
    })
    .defer(d3.csv, "csv/2013_country_data_utf8.csv", function(d) {
        //var droughtRate = (parseFloat(d.D0) + 2 * parseFloat(d.D1) + 3*parseFloat(d.D2) + 4*parseFloat(d.D3) + 5*parseFloat(d.D4) + 1)/1500;
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        if(rate_by_year.has("2013")){
            rate_by_year.get("2013").set(connected_id, unemplyment_rate);
        }
        else {
            var rateById = d3.map();
            rateById.set(connected_id, unemplyment_rate);
            rate_by_year.set("2013", rateById);
        }
    })
    .defer(d3.csv, "csv/2014_country_data_utf8.csv", function(d) {
        //var droughtRate = (parseFloat(d.D0) + 2 * parseFloat(d.D1) + 3*parseFloat(d.D2) + 4*parseFloat(d.D3) + 5*parseFloat(d.D4) + 1)/1500;
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        if(rate_by_year.has("2014")){
            rate_by_year.get("2014").set(connected_id, unemplyment_rate);
        }
        else {
            var rateById = d3.map();
            rateById.set(connected_id, unemplyment_rate);
            rate_by_year.set("2014", rateById);
        }
    })
    .defer(d3.csv, "csv/2015_country_data_utf8.csv", function(d) {
        //var droughtRate = (parseFloat(d.D0) + 2 * parseFloat(d.D1) + 3*parseFloat(d.D2) + 4*parseFloat(d.D3) + 5*parseFloat(d.D4) + 1)/1500;
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        if(rate_by_year.has("2015")){
            rate_by_year.get("2015").set(connected_id, unemplyment_rate);
        }
        else {
            var rateById = d3.map();
            rateById.set(connected_id, unemplyment_rate);
            rate_by_year.set("2015", rateById);
        }
    })
    .defer(d3.csv, "csv/2016_country_data_utf8.csv", function(d) {
        //var droughtRate = (parseFloat(d.D0) + 2 * parseFloat(d.D1) + 3*parseFloat(d.D2) + 4*parseFloat(d.D3) + 5*parseFloat(d.D4) + 1)/1500;
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        if(rate_by_year.has("2016")){
            rate_by_year.get("2016").set(connected_id, unemplyment_rate);
        }
        else {
            var rateById = d3.map();
            rateById.set(connected_id, unemplyment_rate);
            rate_by_year.set("2016", rateById);
        }
    })
    .defer(d3.csv, "csv/2017_country_data_utf8.csv", function(d) {
        //var droughtRate = (parseFloat(d.D0) + 2 * parseFloat(d.D1) + 3*parseFloat(d.D2) + 4*parseFloat(d.D3) + 5*parseFloat(d.D4) + 1)/1500;
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        if(rate_by_year.has("2017")){
            rate_by_year.get("2017").set(connected_id, unemplyment_rate);
        }
        else {
            var rateById = d3.map();
            rateById.set(connected_id, unemplyment_rate);
            rate_by_year.set("2017", rateById);
        }
    })
    .defer(d3.csv, "csv/2018_country_data_utf8.csv", function(d) {
        //var droughtRate = (parseFloat(d.D0) + 2 * parseFloat(d.D1) + 3*parseFloat(d.D2) + 4*parseFloat(d.D3) + 5*parseFloat(d.D4) + 1)/1500;
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        if(rate_by_year.has("2018")){
            rate_by_year.get("2018").set(connected_id, unemplyment_rate);
        }
        else {
            var rateById = d3.map();
            rateById.set(connected_id, unemplyment_rate);
            rate_by_year.set("2018", rateById);
        }
    });

// d3.csv("csv/2010_country_data_utf8.csv",function(error,csvdata){
//     if(error){
//         console.log(error);
//     }
//     // console.log(csvdata);
// });
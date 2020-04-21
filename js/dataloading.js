var rate_by_year = d3.map();
var id_to_countyName = d3.map();
var year_state_county = new Map();
var year_state_rate = new Map();

var formatPercent = d3.format(".2f");

function CountyObject(county_id,county_name,county_rate)
{
    this.county_id=county_id;
    this.county_name=county_name;
    this.county_rate=county_rate;
}

function StateObject(state_id,state_name,state_rate)
{
    this.state_id=state_id;
    this.state_name=state_name;
    this.state_rate=state_rate;
}

d3.queue()
    .defer(d3.csv, "csv/2010_country_data_utf8.csv", function(d) {
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        if (!id_to_countyName.has(connected_id))
        {
            id_to_countyName.set(connected_id, d.county_name);
        }

        construct_rate_by_year("2010", connected_id, unemplyment_rate);

        var county = new CountyObject(connected_id, d.county_name.substring(0, d.county_name.length-4), unemplyment_rate);
        construct_year_state_county("2010",county, d.id);
    })
    .defer(d3.csv, "csv/2011_country_data_utf8.csv", function(d) {
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        construct_rate_by_year("2011", connected_id, unemplyment_rate);


        var county = new CountyObject(connected_id, d.county_name.substring(0, d.county_name.length-4), unemplyment_rate);
        construct_year_state_county("2011",county, d.id);
    })
    .defer(d3.csv, "csv/2012_country_data_utf8.csv", function(d) {
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        construct_rate_by_year("2012", connected_id, unemplyment_rate);


        var county = new CountyObject(connected_id, d.county_name.substring(0, d.county_name.length-4), unemplyment_rate);
        construct_year_state_county("2012",county, d.id);
    })
    .defer(d3.csv, "csv/2013_country_data_utf8.csv", function(d) {
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        construct_rate_by_year("2013", connected_id, unemplyment_rate);


        var county = new CountyObject(connected_id, d.county_name.substring(0, d.county_name.length-4), unemplyment_rate);
        construct_year_state_county("2013",county, d.id);
    })
    .defer(d3.csv, "csv/2014_country_data_utf8.csv", function(d) {
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        construct_rate_by_year("2014", connected_id, unemplyment_rate);


        var county = new CountyObject(connected_id, d.county_name.substring(0, d.county_name.length-4), unemplyment_rate);
        construct_year_state_county("2014",county, d.id);
    })
    .defer(d3.csv, "csv/2015_country_data_utf8.csv", function(d) {
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        construct_rate_by_year("2015", connected_id, unemplyment_rate);


        var county = new CountyObject(connected_id, d.county_name.substring(0, d.county_name.length-4), unemplyment_rate);
        construct_year_state_county("2015",county, d.id);
    })
    .defer(d3.csv, "csv/2016_country_data_utf8.csv", function(d) {
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        construct_rate_by_year("2016", connected_id, unemplyment_rate);


        var county = new CountyObject(connected_id, d.county_name.substring(0, d.county_name.length-4), unemplyment_rate);
        construct_year_state_county("2016",county, d.id);
    })
    .defer(d3.csv, "csv/2017_country_data_utf8.csv", function(d) {
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        construct_rate_by_year("2017", connected_id, unemplyment_rate);


        var county = new CountyObject(connected_id, d.county_name.substring(0, d.county_name.length-4), unemplyment_rate);
        construct_year_state_county("2017",county, d.id);
    })
    .defer(d3.csv, "csv/2018_country_data_utf8.csv", function(d) {
        var unemplyment_rate = parseFloat(d.unemplyment_rate);
        var connected_id = parseInt(d.id + d.county);
        construct_rate_by_year("2018", connected_id, unemplyment_rate);


        var county = new CountyObject(connected_id, d.county_name.substring(0, d.county_name.length-4), unemplyment_rate);
        construct_year_state_county("2018",county, d.id);
    })
    .defer(d3.tsv, "tsv/states_data.tsv", function(d) {
        var unemplyment_rate = parseFloat(d.unemployment_rate);
        var year = parseInt(d.Year);
        if(year >=2010 && year <= 2018)
            construct_year_state_rate(year, d.id, unemplyment_rate);
    }).await(function(error){
        reconstruct_year_state_rate();
});




function construct_year_state_county(year, county,id) {
    if(year_state_county.has(year)){
        if(year_state_county.get(year).has(id))
        {
            year_state_county.get(year).get(id).push(county);
        }
        else
        {
            var countyList = [];
            countyList.push(county);
            year_state_county.get(year).set(id, countyList);
        }
    }
    else {
        var countyList = [];
        countyList.push(county);
        var state_temp_map = new Map();
        state_temp_map.set(id, countyList);
        year_state_county.set(year, state_temp_map);
    }
}

function construct_rate_by_year(year, id, rate)
{
    if(rate_by_year.has(year)){
        rate_by_year.get(year).set(id, rate);
    }
    else {
        var rateById = d3.map();
        rateById.set(id, rate);
        rate_by_year.set(year, rateById);
    }
}

function construct_year_state_rate(year, id ,rate) {
    if(year_state_rate.has(year)){
        if(year_state_rate.get(year).has(id)){
            year_state_rate.get(year).set(id, rate + year_state_rate.get(year).get(id));
        }
        else {
            year_state_rate.get(year).set(id, rate);
        }
    }
    else {
        var rateById = new Map();
        rateById.set(id, rate);
        year_state_rate.set(year, rateById);
    }
}

function reconstruct_year_state_rate(){
    year_state_rate.forEach(function (value, key, map) {
        value.forEach(function (inner_value, inner_key, inner_map) {
            year_state_rate.get(key).set(inner_key, formatPercent(inner_value/12))
        })
    })
}
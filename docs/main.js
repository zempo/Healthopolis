'use strict';

/*
Notes

Air Quality Key: 
Air Quality Endpoints:

https://api.airvisual.com/v2/countries?key=CpizzCTn5NTozBHEW
supported countries 

https://api.airvisual.com/v2/states?country=Canada&key=CpizzCTn5NTozBHEW
supported states 

https://api.airvisual.com/v2/cities?state=Colorado&country=USA&key=CpizzCTn5NTozBHEW
supported cities 

http://api.airvisual.com/v2/city?city=Los%20Angeles&state=California&country=USA&key=CpizzCTn5NTozBHEW
city data 

great, <= 25, no overall health risk
good, 25 < x <= 50, minimal health risk, some risk areas (factories, etc)
fair, 50 < x <= 100, low risk, some pollutants might affect vulnerable groups
poor, 100 < x <= 125,  vulnerable groups more likely to be affected, some warnings 
low, 125 < x <= 150,  vulnerable groups more likely to be affected + long term concerns increase, some warnings 
unhealthy 150 < x <= 200,  health effects likely for everyone, sensitive groups more likely to need hospitalization
very unhealthy 200 < x <= 300,  Many jurisdictions will issue a health alert, hospitalizations more common for general population
hazardous  300 < x, avoid city, if possible. Emergency conditions might be declared.
                  Entire population is likely to be affected

Wikipedia Key:
Wikipedia Endpoint:

News Key:
News Endpoint: 

common errors: 
403, forbidden (too many requests)

$.change.event @ main.js:52
dispatch @ jquery.min.js:2
y.handle @ jquery.min.js:2
ListPicker._handleKeyDown
index.html:1 
Access to fetch at
 'https://api.airvisual.com/v2/states?country=Sweden&key=CpizzCTn5NTozBHEW' 
 from origin 'null' has been blocked by CORS policy:
  No 'Access-Control-Allow-Origin' header is present on the requested resource.
 If an opaque response serves your needs, set the request's mode to 'no-cors'
  to fetch the resource with CORS disabled.
*/

/* ///////////////// Input /////////////////// */
// encode selector value uri data 
// disable submit button before selections are made 
// select country --> loop in regions of country, select region
// select region --> loop in cities
// select cities --> enable submit button! 

function updateRegion(responseJson) {
    const country = $('#country option:selected').val(); 
    $('#region').append(`<option value="">Regions of ${country}</option>`);

    for (let i = 0; i < responseJson.data.length; i++) {
        let opt = responseJson.data[i].state;  
        
        $('#region').append(`<option value="${opt}">${opt}</option>`);
    }
}

function updateCity(responseJson2) {
    const region = $('#region option:selected').val();

    $('#city').append(`<option value="">Cities of ${region}</option>`);

    for (let i = 0; i < responseJson2.data.length; i++) {
        let opt = responseJson2.data[i].city;  
        
        $('#city').append(`<option value="${opt}">${opt}</option>`);
    } 

    $('#city').change(function() {
        $('.searchBtn').prop('disabled', false); 
    });

}

function watchSelect() {
    $( document ).ready(function () {
        $('.searchBtn').prop('disabled', true);
    });

    $('#country').change(event => {
        const country = $('#country option:selected').val();
        const country2 = encodeURI(country);
 
        $('#region').empty();
        
        const url = `https://api.airvisual.com/v2/states?country=${country2}&key=CpizzCTn5NTozBHEW`;

        fetch(url).then(res => {
            if (res.ok) {
                return res.json();
            }
            alert(`Sorry, something went wrong. Check your connection.`);
        }).then(responseJson => {
            updateRegion(responseJson); 
        });
    });

    $('#region').change(event => {
        const country = $('#country option:selected').val();
        const country2 = encodeURI(country);
        const region = $('#region option:selected').val();
        const region2 = encodeURI(region);

        $('#city').empty(); 

        const url = `https://api.airvisual.com/v2/cities?state=${region2}&country=${country2}&key=CpizzCTn5NTozBHEW`;

        fetch(url).then(res => {
            if (res.ok) {
                return res.json();
            }
            alert(`Sorry, something went wrong. Check your connection.`);
        }).then(responseJson2 => {
            updateCity(responseJson2); 
        }); 
    });
}  

$(watchSelect);

/* ///////////////// Results /////////////////// */

const apiKey1 = 'CpizzCTn5NTozBHEW';
const baseURL1 = 'url1';

const apiKey2 = 'key2';
const baseURL2 = 'url2';

const apiKey3 = 'key3';
const baseURL3 = 'url3';

console.log('Script Loaded! Waiting for Input...');

function formatParams(params) {
    // use object keys method 
    // encode + join
}

function displayAQ(responseJson3) {
    // affect other elements on page
    
    // aqius, us air quality standards 
    /*
    <div class="results1" role="results from air-quality api">

    The valid range of latitude in degrees is -90 and +90
     for the southern and northern hemisphere respectively.
      Longitude is in the range -180 and +180
      specifying coordinates west and east of the Prime Meridian, respectively.

    great, <= 25, no overall health risk
good, 25 < x <= 50, minimal health risk, some risk areas (factories, etc)
fair, 50 < x <= 100, low risk, some pollutants might affect vulnerable groups
poor, 100 < x <= 125,  vulnerable groups more likely to be affected, some warnings 
low, 125 < x <= 150,  vulnerable groups more likely to be affected + long term concerns increase, some warnings 
unhealthy 150 < x <= 200,  health effects likely for everyone, sensitive groups more likely to need hospitalization
very unhealthy 200 < x <= 300,  Many jurisdictions will issue a health alert, hospitalizations more common for general population
hazardous  300 < x, avoid city, if possible. Emergency conditions might be declared.
                  Entire population is likely to be affected
    */
   const aqi = responseJson3.data.current.pollution.aqius;
   const city = $('#city').val();
   $('.results1').empty();
   if (aqi <= 25) {
       $('.results1').append(
           `<h2>The Air Quality Index for ${city} is ${aqi}</h2>
           <h3>This city has excellent health. 8.0/8.0</h3>
           <p>There is negligible overall risk to the entire population. This city is among the healthiest, in terms of air quality.</p>`);
           // 1 small white cloud w/ common pollutant
           // dark-green bar below city vector, 100%
           // ^_^ excited sun!
    } else if (aqi > 25 && aqi <= 50) {
        $('.results1').append(
            `<h2>The Air Quality for ${city} is ${aqi}</h2>
            <h3>This city has good health! 7.0/8.0</h3>
            <p>There might be some risky areas, such as factories. Pollution is rarely an issue.</p>`);
            // 2 small gray clouds w/ common pollutant
            // medium-green bar below city vector, 87.5%
            // :) happy sun
    } else if (aqi > 50 && aqi <= 100) {
        $('.results1').append(
            `<h2>The Air Quality for ${city} is ${aqi}</h2>
            <h3>This city has fair health. 6.0/8.0</h3>
            <p>There is low risk overall. However, certain pollutants will affect vulnerable groups.</p>`);
            // 2 clouds, 1 small gray, 1 medium gray 
            // light-green below city vector, 75%
            // smirking sun 
    } else if (aqi > 100 && aqi <= 125) {
        $('.results1').append(
            `<h2>The Air Quality for ${city} is ${aqi}</h2>
            <h3>This city is vulnerable. 5.0/8.0</h3>
            <p>Vulnerable groups are more likely to be affected. Warnings might be issued.</p>`);
            // 3 clouds, 2 small gray, 1 medium gray
            // bright yellow, 62.5%
            // -_- concerned sun, 1 sweat drop, meh-face
    } else if (aqi > 125 && aqi <= 150) {
        $('.results1').append(
            `<h2>The Air Quality for ${city} is ${aqi}</h2>
            <h3>This city has declining health!</h3>
            <p>Vulnerable groups are more likely to be affected -- with some hospitalizations taking place. Warnings aren't uncommon.</p>`);
            // 4 clouds, 3 small gray, 1 medium gray
            // orange, 50% 
            // :/ ...sweating sun, grimacing, 2 drops 
    } else if (aqi > 150 && aqi <= 200) {
        $('.results1').append( 
            `<h2>The Air Quality for ${city} is ${aqi}</h2>
            <h3>This city has poor health! 4.0/8.0</h3>
            <p>Everyone is likely to experience some effects. Vulnerable groups have limited mobility.</p>`);
            // 5 clouds, 3 small gray, 2 medium gray
            // red, 37.5%
            // :D, sun wearing surgical mask
    } else if (aqi > 200 && aqi <= 300) {
        $('.results1').append(
            `<h2>The Air Quality for ${city} is ${aqi}</h2>
            <h3>This city is unhealthy!</h3>
            <p>Health Alerts are common. Pollution directly impacts all members of the population. Serious effects are seen.</p>`);
            // 6 clouds, 3 small gray, 3 medium gray
            // purple, 25%
            // : D, sun wearing WWI gas-mask
    } else if (aqi > 300) {
        $('.results1').append(
            `<h2>The Air Quality for ${city} is ${aqi}</h2>
            <h3>This city is hazardous!</h3>
            <p>Emergency Conditions are met. Serious health effects are common. This city is among the most unhealthy in the world.</p>`);
            // 6 clouds, 2 small gray, 4 medium gray
            // maroon, 12.5%
            // : O, sun wearing hazmat suit 
    } else { 
        $('.results1').append(`<h2>Error 404: Air Quality Index data is absent from this city.</h2>`);
        // funny error message 
    }

   console.log(responseJson3);

   console.log(aqi);  
}

function displayWiki() {
    // display any relevant data 
}

function displayNews() {
    // display any relevant data 
}

function fetchAQ(city, region, country) {
    // fetch aq, update display if there's an error or lack of results 
    // 'Unfortunately, there's no air quality data for this city yet...'
    // can request data, here (link to air quality measurement request form)
    const country2 = encodeURI(country);
    const region2 = encodeURI(region);
    const city2 = encodeURI(city);
    const aqURL = `https://api.airvisual.com/v2/city?city=${city2}&state=${region2}&country=${country2}&key=CpizzCTn5NTozBHEW`;
    console.log(aqURL);  
 
    fetch(aqURL).then(res => { 
        if (res.ok) {
            return res.json();
        } 
        alert(`That's odd. It appears this city's data is temporarily unavailable. This does happen, sometimes. Our sincere apologies. =(`);
        // add funny error message image 
    }).then(responseJson3 => {
        displayAQ(responseJson3); 
    });  
}

function fetchWiki() {
    // fetch wiki data 
    // log info or error message (exclamation point in div)
    // 'Error: Wikipedia Doesn't have info about this city...yet...
    // link to creating wikipedia articles 
    console.log('Fetched Wikipedia');
}

function fetchNews(city) {
    // grab news data
    // log info or error message (exclamation point in div)
    // 'Error: There is no news about your city among English results 
    console.log(city);
}


function fetchAll(city, region, country) {
    fetchAQ(city, region, country);
    fetchWiki();
    fetchNews(city); 
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();

        const country = $('#country').val();
        const region = $('#region').val();
        const city = $('#city').val();
        console.log(`Getting results for ${city}`);
        fetchAll(city, region, country);
    });
}

$(watchForm);
 
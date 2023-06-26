/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + '-' + month + '-' + year;
  return time;
}
function formatWeatherResponse(weatherSummary){
    let currentData = weatherSummary["current"];
    let weeklyData = weatherSummary["daily"];
    var mainDescription = "Description Current Weather: " + currentData["weather"][0]["description"];
    var currentFormatted = "<ul>";
    currentFormatted += "<li> Temp: "+currentData["temp"] + "</li>";
    currentFormatted += "<li> Pressure: "+currentData["pressure"] + "</li>";
    currentFormatted += "<li> Humidity: "+currentData["humidity"] + "</li>";
    currentFormatted += "<li> Windspeed: "+currentData["wind_speed"] + "</li>";
    currentFormatted += "</ul>";
    var weekyFormatted = "<table><tr><th>Date</th><th>Temp</th><th>Pressure</th><th>Windspeed</th><th>Humidity</th></tr>";
    for (var i = 0 ; i < 7; i++) {
        var daily = weeklyData[i];
        weekyFormatted += "<td>"+ timeConverter(daily["dt"]) + "</td>";
        weekyFormatted += "<td>" + daily["temp"]["day"] + "</td>";
        weekyFormatted += "<td>" + daily["pressure"] + "</td>";
        weekyFormatted += "<td>" + daily["wind_speed"] + "</td>";
        weekyFormatted += "<td>" + daily["humidity"] + "</td>";
        weekyFormatted += "</tr>" 
    }
    weekyFormatted += "</table>"
    const formattedWeatherSummary = mainDescription+ "<br>" + currentFormatted + "<br>" + weekyFormatted;
    return formattedWeatherSummary;
}
async function main(params) {
    var axios = require('axios');
    const apiKey = params["apiKey"];
    const zipCode = params["zipCode"];
    const endpointGeocode = "http://api.openweathermap.org/geo/1.0/zip?zip="+zipCode+",IN&appid="+apiKey;
    const responseGeocode = await axios.get(endpointGeocode)
    const lat = responseGeocode.data["lat"];
    const lon = responseGeocode.data["lon"];
    const endpointWeather = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly&appid="+apiKey+"&units=metric"
    const responseWeather = await axios.get(endpointWeather)
    return {"result":formatWeatherResponse(responseWeather.data)}
}
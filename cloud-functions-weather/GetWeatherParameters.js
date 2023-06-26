/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
 async function main(params) {
    var axios = require('axios');
    const apiKey = params["apiKey"];
    const zipCode = params["zipCode"];
    const endpointGeocode = "http://api.openweathermap.org/geo/1.0/zip?zip="+zipCode+",IN&appid="+apiKey;
    const responseGeocode = await axios.get(endpointGeocode)
    const lat = responseGeocode.data["lat"];
    const lon = responseGeocode.data["lon"];
    const endpointWeather = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly&appid="+apiKey+"&units=metric"
    const responseWeather = await axios.get(endpointWeather);
    const current = responseWeather.data["current"];
    return {"temp":current["temp"],"pressure":current["pressure"],"humidity":current["humidity"]};
}
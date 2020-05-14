/* Global Variables */
require('dotenv').config()
const fetch = require("node-fetch");
const geoMapKey = process.env.GEOMAP_ID;

// Initialize Geocoder api
var GeocoderGeonames = require('geocoder-geonames'),
    geocoder = new GeocoderGeonames({
      username:      process.env.GEOMAP_API,
    });

var validateTDW = require('./validateTDWeather');

const projectData = [];
let newEntry = '';

var path = require('path')
/* Express to run server and routes */
const express = require('express');
/* Start up an instance of app */
const app = express();
/* Dependencies */
const bodyParser = require('body-parser')
/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

/* Initialize the main project folder*/
app.use(express.static('dist'));

console.log(__dirname)

// Set the server endpoint
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// Endpoint to get lat and lon coordinates from City name input from the user.
app.get('/getCityCoordinates', function (req, res) {
  console.log('City Name:' + req.query.cityName)
  console.log('Days to travel from the server: ' + req.query.daysToTravel)
  console.log('Travel date: ', req.query.travelDate);
  // GET call to coordiantes service.
  geocoder.get('search',{
    q: req.query.cityName
  })
  .then(function(response){
    console.log(typeof response);
    var keys = Object.keys(response);
    console.log("Accessing Long: "+ response['geonames'][0]['lng'] + "and lat: " + response['geonames'][0]['lat'])

    // Collect and persist useful information.
    newEntry = {
      lat: response['geonames'][0]['lat'],
      lng: response['geonames'][0]['lng'],
      name: response['geonames'][0]['name'],
      countryName: response['geonames'][0]['countryName'],
      daysToTravel: req.query.daysToTravel,
      travelDate: req.query.travelDate
    }

    projectData.push(newEntry);
    const index = projectData.length-1;

    res.send(projectData[index]);

  })
  .catch(function(error){
    console.log(error);
    console.log("We are in geo location error screen")
    newEntry = {
      lat: NaN,
      lng: NaN,
      name: null,
      countryName: null,
      daysToTravel: null,
      travelDate: null
    }
    // If we fall in error response, save null data.
    projectData.push(newEntry);
    const index = projectData.length-1;
    res.send(projectData[index]);
  });
})

// GET weather forecast or history depending on how far is the date of travel from today.
app.get('/getWeatherForecast', function (req, res) {

  let baseURL = '';

  const lat = req.query.lat;
  const lng = req.query.lng;
  const API_KEY = process.env.WBIT_API;
  const daysToTravel = req.query.daysToTravel;
  const welcomeScreen = req.query.welcomeScreen;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  //console.log("THIS IS THE WELCOME SCREEN: ", welcomeScreen);

  // GET weather forecast if days for the date of travel is less than 16. Otherwise GET weather history.
  if (daysToTravel < 16) {
    baseURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${API_KEY}&units=I`
  } else {
    baseURL = `https://api.weatherbit.io/v2.0/history/daily?lat=${lat}&lon=${lng}&key=${API_KEY}&start_date=${start_date}&end_date=${end_date}&units=I`
  }

  //console.log("Calling Weather API from server: ", baseURL);

  // GET call to weather service.
  getWeather(baseURL)
  .then(function(response){ 

    const jsonArray = response['data'];
    const cityName = response['city_name'] + ', ' + response['country_code'] ;
    const timeZone = response['timezone'];

    console.log("weatherArray Length: ", jsonArray.length);
    console.log("weatherArray Low Temp: ", jsonArray[0]['low_temp']);
    console.log("weatherArray Max Temp: ", jsonArray[0]['max_temp']);
    console.log("weatherArray cityName: ", cityName);
    console.log("weatherArray timeZone: ", timeZone);
    console.log("WeatherArray datetime: ", jsonArray[0].datetime)

    // Format weather data depending on the date of travel, weather forecast or history.
    const weatherInfo = validateTDW.getWeatherIfInTravelWindow(jsonArray, daysToTravel);

    console.log("This is the returned weather info after validation: ", weatherInfo);
    weatherInfo['cityName'] = cityName;
    weatherInfo['timeZone'] = timeZone;

    // Select how to persist data, if comming from welcome screen we didn't call geolocation service, then there is no previous data indexed.
    if (welcomeScreen == 1) {
      projectData.push(weatherInfo);
    } else {
      projectData[projectData.length-1]['weatherInfo'] = weatherInfo;
    }

    res.send(projectData[projectData.length-1]);
  })
  .catch(function(error){
    console.log(error);
  });
})

// GET image from pixabay service.
app.get('/getImageFromTravelPlace', function (req, res) { 
  
  const cityName = req.query.cityName;
  const API_KEY = process.env.PIXABAY_API;

  const encodedURI = encodeURIComponent(cityName);
  console.log('Encoded URI: ', encodedURI)

  const baseURL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodedURI}`

  getImage(baseURL)
  .then(function(response){ 

    // We randomly select an image from the results, we need the total images returned.
    const howManyImagesReturned = response['hits'].length;

    if (howManyImagesReturned > 0) {
      console.log(`We got ${howManyImagesReturned} from pixabay`);

      // Select random image from the results.
      const pickRandomImage = Math.floor(Math.random() * howManyImagesReturned); 
      console.log(`Selecting random image # ${pickRandomImage}`)

      const randomImage = response['hits'][pickRandomImage];

      const imageInfo = {
        'imagesURL' : randomImage['webformatURL'],
        'imageWidth' : randomImage['webformatWidth'],
        'imageHeight' : randomImage['webformatHeight']
      }

      console.log("This is the random Image Info: ", JSON.stringify(imageInfo));

      projectData[projectData.length-1]['imageInfo'] = imageInfo;

      console.log("This is the complete object server side: ", projectData[projectData.length-1]);

      res.send(projectData[projectData.length-1]);

    } else {
      // If now image returned, use a happy face at least :)
      console.log('Use a placehodler image');
      const imageInfo = {
        'imagesURL' : 'https://pixabay.com/get/54e9d24a4b52ab14f1dc84609629317a1639dce6554c704c7d267fd49e4cc15a_640.jpg',
        'imageWidth' : 780,
        'imageHeight' : 439
      }
      projectData[projectData.length-1]['imageInfo'] = imageInfo;
      res.send(projectData[projectData.length-1]);
    }

  })
  .catch(function(error){
    console.log(error);
  });
});

// Call weatherbit with lat and lng
const getWeather = async (baseURL)=>{
  const res = await fetch(baseURL)
  try {
      const data = await res.json();
      return data;
  } catch(error) {
      console.log('error', error)
  }
}

// Call pixabit with city name
const getImage = async (baseURL)=>{
  const res = await fetch(baseURL)
  // const res = await fetch(baseURL + zip + apiKey)
  try {
      const data = await res.json();
      // console.log('Data from PIXABAY API: ',  data);
      return data;
  } catch(error) {
      console.log('error', error)
  }
}

const port = 8081;
/* Spin up the server*/
app.listen(port, listening);
 function listening(){
    console.log(`running on localhost: ${port}`);
  };
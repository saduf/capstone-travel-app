/*server.js*/
/* Empty JS object to act as endpoint for all routes */

// Import helper functions
//import { getWeatherIfInTravelWindow } from './validateTDWeather.js';

/* Global Variables */
require('dotenv').config()
const fetch = require("node-fetch");
const geoMapKey = process.env.GEOMAP_ID;

var GeocoderGeonames = require('geocoder-geonames'),
    geocoder = new GeocoderGeonames({
      username:      process.env.GEOMAP_API,
    });

var validateTDW = require('./validateTDWeather');

const projectData = [];
let newEntry = '';
//let daysToTravel = 0;

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

const port = 3000;
/* Spin up the server*/
const server = app.listen(port, listening);
 function listening(){
    // console.log(server);
    console.log(`running on localhost: ${port}`);
  };

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
    //res.sendFile(path.resolve('src/client/views/index.html'))
})

app.get('/getCityCoordinates', function (req, res) {
  console.log('City Name:' + req.query.cityName)
  console.log('Days to travel from the server: ' + req.query.daysToTravel)

  geocoder.get('search',{
    q: req.query.cityName
  })
  .then(function(response){
    // var jsonObjectResponse = JSON.parse(response);
    console.log(typeof response);
    var keys = Object.keys(response);
    console.log("KEYS:", keys)
    console.log("Total Results Count: ", response['totalResultsCount'])
    console.log("First Element: ", response['geonames'][0])
    console.log("Accessing Long: "+ response['geonames'][0]['lng'] + "and lat: " + response['geonames'][0]['lat'])

    newEntry = {
      lat: response['geonames'][0]['lat'],
      lng: response['geonames'][0]['lng'],
      name: response['geonames'][0]['name'],
      countryName: response['geonames'][0]['countryName'],
      daysToTravel: req.query.daysToTravel
    }

    projectData.push(newEntry);
    const index = projectData.length-1;
    res.send(projectData[index]);

  })
  .catch(function(error){
    console.log(error);
  });
  //res.sendFile(path.resolve('src/client/views/index.html'))
})

app.get('/getWeatherForecast', function (req, res) {
  console.log('Lat:' + req.query.lat)
  console.log('Lon: ' + req.query.lng)
  console.log('Days to travel: ', req.query.daysToTravel);

  const lat = req.query.lat;
  const lng = req.query.lng;
  const API_KEY = process.env.WBIT_API;
  const daysToTravel = req.query.daysToTravel;

  const baseURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${API_KEY}`

  console.log("Calling Weather API from server: ", baseURL);

  getWeather(baseURL)
  .then(function(response){ 
    //console.log("Returned data from API: ", response);
    var keys = Object.keys(response);
    console.log("KEYS:", keys)
    const jsonArray = response['data'];
    const cityName = response['city_name'] + ', ' + response['country_code'] ;
    const timeZone = response['timezone'];
    //console.log('weatherArray: ', jsonArray);
    console.log("weatherArray Length: ", jsonArray.length);
    console.log("weatherArray Description: ", jsonArray[0]['weather']['description']);
    console.log("weatherArray Low Temp: ", jsonArray[0]['low_temp']);
    console.log("weatherArray Max Temp: ", jsonArray[0]['max_temp']);
    console.log("weatherArray cityName: ", cityName);
    console.log("weatherArray timeZone: ", timeZone);

    const weatherInfo = validateTDW.getWeatherIfInTravelWindow(jsonArray, daysToTravel);
    console.log("This is the returned weather info after validation: ", weatherInfo);
    // console.log("weatherInfo Description: ", weatherInfo['weather']['description']);
    // console.log("weatherInfo Low Temp: ", weatherInfo['low_temp']);
    // console.log("weatherInfo Max Temp: ", weatherInfo['max_temp']);
    // console.log("weatherInfo cityName: ", cityName);
    // console.log("weatherInfo timeZone: ", timeZone);
    weatherInfo['cityName'] = cityName;
    weatherInfo['timeZone'] = timeZone;
    console.log("This is the weather info after appending city and timezone: ", weatherInfo);

    projectData[projectData.length-1]['weatherInfo'] = weatherInfo;
    console.log("This is the data persistance after updating with the weather info: ");
    console.log(projectData[projectData.length-1]);

    res.send(projectData[projectData.length-1]);
  })
  .catch(function(error){
    console.log(error);
  });

  // geocoder.get('search',{
  //   q: req.query.cityName
  // })
  // .then(function(response){
  //   // var jsonObjectResponse = JSON.parse(response);
  //   console.log(typeof response);
  //   var keys = Object.keys(response);
  //   console.log("KEYS:", keys)
  //   console.log("Total Results Count: ", response['totalResultsCount'])
  //   console.log("First Element: ", response['geonames'][0])
  //   console.log("Accessing Long: "+ response['geonames'][0]['lng'] + "and lat: " + response['geonames'][0]['lat'])

  //   newEntry = {
  //     lat: response['geonames'][0]['lat'],
  //     lng: response['geonames'][0]['lng'],
  //     name: response['geonames'][0]['name'],
  //     countryName: response['geonames'][0]['countryName'],
  //     daysToTravel: req.query.daysToTravel
  //   }

  //   projectData.push(newEntry);
  //   const index = projectData.length-1;
  //   res.send(projectData[index]);

  // })
  // .catch(function(error){
  //   console.log(error);
  // });
})

// Call weatherbit with lat and lng
const getWeather = async (baseURL)=>{
  const res = await fetch(baseURL)
  // const res = await fetch(baseURL + zip + apiKey)

  try {
      const data = await res.json();
      //console.log('Data from weather API: ',  data);
      return data;
  } catch(error) {
      console.log('error', error)
  }
}

//GET Route I: Server Side
app.get('/all', sendObject);

function sendObject (request, response) {
  response.send(projectData);
  console.log('GET Route I, sending JS Object');
};

//GET Route II: Client Side
app.get('/getLast', sendData);

function sendData (request, response) {
  response.send(projectData[projectData.length-1]);
  console.log('In GET Route II', projectData);
};

// POST route
app.post('/add', callBack);

function callBack(req,res){

  // newEntry = {
  //   temperature: req.body.temperature,
  //   date: req.body.date,
  //   userResponse: req.body.userResponse
  // }
  //   projectData.push(newEntry);
  //   console.log(projectData)

  //   res.send(projectData);

    // geocoder.get('search',{
    //   q: 'Berlin'
    // })
    // .then(function(response){
    //   console.log(response);
    // })
    // .catch(function(error){
    //   console.log(error);
    // });
}
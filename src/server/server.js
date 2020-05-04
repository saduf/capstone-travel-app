/*server.js*/
/* Empty JS object to act as endpoint for all routes */

/* Global Variables */
require('dotenv').config()

const geoMapKey = process.env.GEOMAP_ID;

var GeocoderGeonames = require('geocoder-geonames'),
    geocoder = new GeocoderGeonames({
      username:      process.env.GEOMAP_API,
    });

const projectData = [];
let newEntry = '';

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
  })
  .catch(function(error){
    console.log(error);
  });
  //res.sendFile(path.resolve('src/client/views/index.html'))
})

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
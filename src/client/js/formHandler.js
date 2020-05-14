const fetch = require("node-fetch");
import { dateValidation } from './validateData'
import { getLocation, displayResultsHTML } from './displayWelcomeScreen'

let cityName = '';
let retValue='';

// This method connects to GeocoderGeonames to get lat and lon coordinates.
function getCityCoordinates () {

    cityName = document.getElementById('city').value;
    //console.log("City name @ app: " + cityName)
    const travelDate = document.getElementById('travelDate').value;

    if ( cityName && travelDate) {
        // This method validates the date to travel, and returns the start and end date to use with historical weather data. 
        // It also returns the number of days to the date of travel.
        retValue = dateValidation(travelDate);
        //console.log("Days to travel", retValue.daysToTravel);

        // Only make the server call if the date to travel is in the future and no more than 1 year apart.
          if (retValue.daysToTravel > 0) {
            // Get the actual long and lat
            getGeoResponse(cityName, retValue.daysToTravel, travelDate)
            .then(function(data) {

              //console.log('Data comming from the server: ', data);

              // Location was found with data input from the user.
              if (data.lat != null && data.lng != null) {
                  // Use the lat and long values, and the date of travel to get weather forecast or history.
                  getWeatherForecast(data.lat, data.lng, retValue.daysToTravel, retValue.start_date, retValue.end_date)
                    .then(function(data) {
                      //console.log("DATA COMMING FROM WEATHER BIT: ", data);
                      // Get an image from the place to travel using Pixabit API.
                      getImageFromTravelPlace(data.name)
                        .then( function(data) {
                          //console.log('This is the complete data APP side: ', data);
                          // Once we collected location, weather, and picture information, display results on the screen.
                          displayResultsHTML(data);
                        })
                    })
                    // Double check user input if location is not found.
                  } else {
                    console.log("Please enter a valid place to travel");
                    const validateMessage = "Please enter a valid place to travel \
                                              <br> &#9747; Please check your spelling."
                    validateTextDisplay(validateMessage)
                  }
            })
        // Invalid date to travel, display error meesage.
        } else {
          console.log("Please enter a valid date to travel, no in the past, not today, not in the future");
          const validateMessage = "Please enter a valid date to travel \
                                    <br> &#9747; Not the same day, not in the past \
                                    <br> &#9747; and not more than 1 year away."
          validateTextDisplay(validateMessage)
        }
    } else {
      // If user input is empty, display error message.
      const validateMessage = "Please fill Location and Date to travel"
      validateTextDisplay(validateMessage)
    }
}

//Actually display error message.
function validateTextDisplay(validateMesage) {
  const validateElement = document.getElementById('search-top');
  console.log("EMPTY TRAVEL DATE OR TRAVEKL CITY");
  const innerHTMLString = 
              `<div class="bar error">
              &#9747; ${validateMesage}
              </div>`
  validateElement.innerHTML = innerHTMLString;
}

/*Asyn call GET to Weather API*/
const getGeoResponse = async (cityName, daysToTravel, travelDate)=>{

    const geoBaseURL = `http://localhost:8081/getCityCoordinates?cityName=${cityName}&daysToTravel=${daysToTravel}&travelDate=${travelDate}`;
    const res = await fetch(geoBaseURL)

    try {
        const data = await res.json();
        //console.log('Data from GeoMAp API: ',  data);
        return data;
    } catch(error) {
        console.log('error', error)
    }
}

/*Asyn call GET to Weather API*/
const getWeatherForecast = async (lat, lng, daysToTravel, start_date=0, end_date=0, welcomeScreen=0)=>{

  const weatherBaseAPI = `http://localhost:8081/getWeatherForecast?lat=${lat}&lng=${lng}&daysToTravel=${daysToTravel}&welcomeScreen=${welcomeScreen}&start_date=${start_date}&end_date=${end_date}`;
  //console.log("lat: " + lat + " and lng: " + lng)
  //console.log('Weather Base URL: ' + weatherBaseAPI);
  //console.log('Days to Travel from getWeatherForecast: ' + daysToTravel);
  const res = await fetch(weatherBaseAPI)
  // const res = await fetch(baseURL + zip + apiKey)

  try {
      const data = await res.json();
      //console.log('Data from Weather  BIT: ',  data);
      return data;
  } catch(error) {
      console.log('error', error)
  }
}

/*Asyn call GET to Pixabay API*/
const getImageFromTravelPlace = async (cityName)=>{
  const pixabayBaseAPI = `http://localhost:8081/getImageFromTravelPlace?cityName=${cityName}`;
  //console.log('City name going to server: ' + cityName);
  const res = await fetch(pixabayBaseAPI)
  try {
      const data = await res.json();
      //console.log('Data Pixabay API: ',  data);
      return data;
  } catch(error) {
      console.log('error', error)
  }
}

  // Listen for dom loaded to display welcome screen
document.addEventListener('DOMContentLoaded', function () {
  // Load the calendar library to aid with the date selection.
  const datepicker = require('js-datepicker')
  const picker = datepicker('#travelDate')
  // // Add listener to button with id generate
  document.getElementById('generate').addEventListener('click', getCityCoordinates);
  console.log('the DOM is ready to be interacted with!');
  getLocation();
});

//module.exports = getCityCoordinates;
export { getCityCoordinates, 
           getWeatherForecast,
           getImageFromTravelPlace,
           getGeoResponse }
  
  

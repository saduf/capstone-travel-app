import { dateValidation } from './validateData.js'

import { getLocation } from './displayWelcomeScreen.js'

import { displayReesultsHTML } from './displayWelcomeScreen.js'

//const weatherBaseAPI = 'http://localhost:3000/getWeatherForecast?long=';
//let lat = "0.0";
//let lng = "0.0";
let cityName = '';
let userResponse = '';

let retValue='';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();

const datepicker = require('js-datepicker')

const picker = datepicker('#travelDate')

console.log("Todays date is: ", newDate)

// Add listener to button with id generate
document.getElementById('generate').addEventListener('click', getCityCoordinates);

// Listen for dom loaded to display welcome screen
document.addEventListener('DOMContentLoaded', function () {
  console.log('the DOM is ready to be interacted with!');
  //x = document.getElementsByClassName("display-results")[0];
  //console.log("This is x in page loading: ", x);
  getLocation();
});

function getCityCoordinates(e) {
    cityName = document.getElementById('city').value;
    console.log("City name @ app: " + cityName)
    const travelDate = document.getElementById('travelDate').value;

    if ( cityName && travelDate) {

        retValue = dateValidation(travelDate);

        console.log("Days to travel", retValue.daysToTravel);

        // Only make the server call if the date to travel is in the future and no more than 1 year apart.
          if (retValue.daysToTravel > 0) {
            // var keys = Object.keys(travelDate);
            // console.log("KEYS:", keys)
            
            getGeoResponse(cityName, retValue.daysToTravel, travelDate)

            .then(function(data) {

              console.log('Data comming from the server: ', data);

              // Location was not found with data input from the user, display error.
              if (data.lat != null && data.lng != null) {

                  getWeatherForecast(data.lat, data.lng, retValue.daysToTravel, retValue.start_date, retValue.end_date)
                  // userResponse = document.getElementById('feelings').value;
                  // newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

                    .then(function(data) {

                      console.log("DATA COMMING FROM WEATHER BIT: ", data);
                      getImageFromTravelPlace(data.name)

                        .then( function(data) {

                          console.log('This is the complete data APP side: ', data);

                          displayReesultsHTML(data);

                            // //Add data to post request
                            // postData('http://localhost:3000/add', {temperature: data.main.temp, date: newDate, userResponse: userResponse} )
                            // .then(
                            //     updateUI()
                            // )
                        })
                    })
                  } else {
                    console.log("Please enter a valid place to travel");
                    const validateMessage = "Please enter a valid place to travel \
                                              <br> &#9747; Please check your spelling."
                    validateTextDisplay(validateMessage)
                  }
            })

        } else {
          console.log("Please enter a valid date to travel, no in the past, not today, not in the future");
          const validateMessage = "Please enter a valid date to travel \
                                    <br> &#9747; Not the same day, not in the past \
                                    <br> &#9747; and not more than 1 year away."
          validateTextDisplay(validateMessage)
        }
    } else {
      const validateMessage = "Please fill Location and Date to travel"
      validateTextDisplay(validateMessage)
      // const validateElement = document.getElementById('search-top');
      //   console.log("EMPTY TRAVEL DATE OR TRAVEKL CITY");
      //   const innerHTMLString = 
      //               `<div class="bar error">
      //               &#9747; EMPTY TRAVEL DATE OR CITY
      //               </div>`
      //   validateElement.innerHTML = innerHTMLString;
    }
}

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

   // const res = await fetch(geoBaseURL + cityName + "&daysToTravel=" + daysToTravel)
    const geoBaseURL = `http://localhost:3000/getCityCoordinates?cityName=${cityName}&daysToTravel=${daysToTravel}&travelDate=${travelDate}`;
    //const res = await fetch(geoBaseURL + cityName + "&daysToTravel=" + daysToTravel)
    const res = await fetch(geoBaseURL)
    // const res = await fetch(baseURL + zip + apiKey)

    try {
        const data = await res.json();
        console.log('Data from GeoMAp API: ',  data);
        return data;
    } catch(error) {
        console.log('error', error)
    }
}

/*Asyn call GET to Weather API*/
const getWeatherForecast = async (lat, lng, daysToTravel, start_date=0, end_date=0, welcomeScreen=0)=>{
  //const lat = lat;
  //const lng = lng;
  //const daysToTravel = daysToTravel;
  const weatherBaseAPI = `http://localhost:3000/getWeatherForecast?lat=${lat}&lng=${lng}&daysToTravel=${daysToTravel}&welcomeScreen=${welcomeScreen}&start_date=${start_date}&end_date=${end_date}`;
  console.log("lat: " + lat + " and lng: " + lng)
  console.log('Weather Base URL: ' + weatherBaseAPI);
  console.log('Days to Travel from getWeatherForecast: ' + daysToTravel);
  const res = await fetch(weatherBaseAPI)
  // const res = await fetch(baseURL + zip + apiKey)

  try {
      const data = await res.json();
      console.log('Data from Weather  BIT: ',  data);
      return data;
  } catch(error) {
      console.log('error', error)
  }
}

/*Asyn call GET to Pixabay API*/
const getImageFromTravelPlace = async (cityName)=>{
  //const lat = lat;
  //const lng = lng;
  //const daysToTravel = daysToTravel;
  const pixabayBaseAPI = `http://localhost:3000/getImageFromTravelPlace?cityName=${cityName}`;
  console.log('City name going to server: ' + cityName);
  const res = await fetch(pixabayBaseAPI)
  // const res = await fetch(baseURL + zip + apiKey)
  try {
      const data = await res.json();
      console.log('Data Pixabay API: ',  data);
      return data;
  } catch(error) {
      console.log('error', error)
  }
}

/* Function to POST data */
const postData = async ( url = '', data = {})=>{
    console.log(data)
      const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header        
    });
  
      try {
        const newData = await response.json();
        // console.log(newData);
        return newData
      }catch(error) {
      console.log("error", error);
      // appropriately handle the error
      }
  }
  
  /*Asyn call GET to Dynamically Update UI*/
  const updateUI = async () => {
    const request = await fetch('http://localhost:3000/getLast');
    try{
      const allData = await request.json();
      //const index = allData.length-1;
      //console.log('Index length', index);
      // document.getElementById('date').innerHTML = 'Date: ' + allData[index].date;
      // document.getElementById('temp').innerHTML = 'Temperature: ' + allData[index].temperature;
      // document.getElementById('content').innerHTML = 'User entry: ' + allData[index].userResponse;
      document.getElementById('date').innerHTML = 'Date: ' + allData.date;
      document.getElementById('temp').innerHTML = 'Temperature: ' + allData.temperature;
      document.getElementById('content').innerHTML = 'User entry: ' + allData.userResponse;
  
    }catch(error){
      console.log("error", error);
    }
  }

  export { getCityCoordinates }
  export { getWeatherForecast }
  export { getImageFromTravelPlace }
  
  

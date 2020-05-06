import { dateValidation } from './validateDate.js'

const geoBaseURL = 'http://localhost:3000/getCityCoordinates?cityName=';
//const weatherBaseAPI = 'http://localhost:3000/getWeatherForecast?long=';
let lat = "0.0";
let lng = "0.0";
let cityName = '';
let userResponse = '';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();

const datepicker = require('js-datepicker')

const picker = datepicker('#travelDate')

console.log("Todays date is: ", newDate)

// Add listener to button with id generate
document.getElementById('generate').addEventListener('click', getCityCoordinates);

function getCityCoordinates(e) {
    cityName = document.getElementById('city').value;
    console.log("City name @ app: " + cityName)
    const travelDate = document.getElementById('travelDate').value;

    const daysToTravel = dateValidation(travelDate);

    console.log("Days to travel", daysToTravel);

    // Only make the server call if the date to travel is in the future and no more than 1 year apart.
      if (daysToTravel > 0) {
        // var keys = Object.keys(travelDate);
        // console.log("KEYS:", keys)
        
        getGeoResponse(cityName, daysToTravel)

        .then(function(data) {

          console.log('Data comming from the server: ', data);

          getWeatherForecast(data.lat, data.lng)
            // userResponse = document.getElementById('feelings').value;
            // newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

            //Add data to post request
            postData('http://localhost:3000/add', {temperature: data.main.temp, date: newDate, userResponse: userResponse} )
            .then(
                updateUI()
            )
        })

    } else {
      console.log("Please enter a valid date to travel, no in the parseInt, not today, not in the future");
    }
}

/*Asyn call GET to Weather API*/
const getGeoResponse = async (cityName, daysToTravel)=>{
    const res = await fetch(geoBaseURL + cityName + "&daysToTravel=" + daysToTravel)
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
const getWeatherForecast = async (lat, lng)=>{
  lat = lat;
  lng = lng;
  const weatherBaseAPI = `http://localhost:3000/getWeatherForecast?lat=${lat}&lng=${lng}`;
  console.log("lat: " + lat + " and lng: " + lng)
  console.log('Weather Base URL: ' + weatherBaseAPI);
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
  
  

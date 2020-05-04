import { dateValidation } from './validateDate.js'

const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
let cityName = '';
let userResponse = '';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();

const datepicker = require('js-datepicker')

const picker = datepicker('#travelDate')

const monthsMap = { 'Jan': 1,
                  'Feb': 2,
                  'Mar': 3,
                  'Apr': 4,
                  'May': 5,
                  'Jun': 6,
                  'Jul': 7,
                  'Aug': 8,
                  'Sep': 9,
                  'Oct': 10,
                  'Nov': 11,
                  'Dec': 12
                }
const daysMap = { '1': 31,
                  '2': 28,
                  '3': 31,
                  '4': 30,
                  '5': 31,
                  '6': 30,
                  '7': 31,
                  '8': 31,
                  '9': 30,
                  '10': 31,
                  '11': 30,
                  '12': 31
}

console.log("Todays date is: ", newDate)

// Add listener to button with id generate
document.getElementById('generate').addEventListener('click', getWeatherByZip);

function getWeatherByZip(e) {
    cityName = document.getElementById('city').value;
    console.log("City name @ app: " + cityName)
    const travelDate = document.getElementById('travelDate').value;

    dateValidation(travelDate);

    var keys = Object.keys(travelDate);
    console.log("KEYS:", keys)
    
    getResponse(cityName)

    .then(function(data) {
        userResponse = document.getElementById('feelings').value;
        newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

        // console.log(data);

        // console.log('Temperature', data.main.temp);
        // console.log('Date:', newDate);
        // console.log('userResponse', userResponse)

        //Add data to post request
        postData('http://localhost:3000/add', {temperature: data.main.temp, date: newDate, userResponse: userResponse} )
        .then(
            updateUI()
        )
    })
}

/*Asyn call GET to Weather API*/
const getResponse = async (cityName)=>{
    const res = await fetch('http://localhost:3000/getCityCoordinates?cityName=' + cityName)
    // const res = await fetch(baseURL + zip + apiKey)

    try {
        const data = await res.json();
        console.log('Data from GeoMAp API: ',  data);
        console.log("Main Temp: ", data.main.temp);
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

  export { getWeatherByZip }
  
  

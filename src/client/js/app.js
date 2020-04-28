/* Global Variables */

const apiKey = '';
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
let zip = '';
let userResponse = '';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();


// Add listener to button with id generate
document.getElementById('generate').addEventListener('click', getWeatherByZip);

function getWeatherByZip(e) {
    zip = document.getElementById('zip').value;
    getResponse(baseURL, zip, apiKey)

    .then(function(data) {
        userResponse = document.getElementById('feelings').value;
        newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

        // console.log(data);

        console.log('Temperature', data.main.temp);
        console.log('Date:', newDate);
        console.log('userResponse', userResponse)

        //Add data to post request
        postData('/add', {temperature: data.main.temp, date: newDate, userResponse: userResponse} )
        .then(
            updateUI()
        )
    })
}

/*Asyn call GET to Weather API*/
const getResponse = async (baseURL, zip, apiKey)=>{
    const res = await fetch(baseURL + zip + ',us' + apiKey + '&units=imperial')
    // const res = await fetch(baseURL + zip + apiKey)

    try {
        const data = await res.json();
        console.log('Data from weather API: ',  data);
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
    const request = await fetch('/getLast');
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
  
  

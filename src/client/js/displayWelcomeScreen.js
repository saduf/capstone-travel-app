import { getWeatherForecast } from './app.js'
import { getImageFromTravelPlace } from './app.js'

let x = '';
  
  function getLocation() {
    x = document.getElementsByClassName("display-results")[0];
    console.log("This is x in getLocation: ", x);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, errorCallback,{timeout:5000});
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  function errorCallback () {
    x.innerHTML = "Geolocation is not supported by this browser, Error call back.";
    // Geolocation is blocked by the browser or not supported, display default welcome Message.
    const defaultLat = 19.741755;
    const defaultLon = -155.844437;
    const defaultLocation = 1;
    const daysToTravel = 0;
    displayWelcomeMessage (defaultLat, defaultLon, daysToTravel, defaultLocation);
  }
  
  function showPosition(position) {
    console.log("This is x in showPosition: ", x);
    console.log('This is the position lat: ', position.coords.latitude);
    console.log('This is the position long: ', position.coords.longitude);
    const innerText = `<p>Latitude: ${position.coords.latitude} <br>Longitude: ${position.coords.longitude} </p>`;
    console.log('innerText: ', innerText)
    const daysToTravel = 0;
    const defaultLocation = 0
  
    if (position.coords.latitude == null || position.coords.latitude == '' || 
        position.coords.longitude == null || position.coords.longitude == '') {
          console.log('LOCATION INFORMATION NOT ALLOWED');
          x.innerHTML = "Corridinates not found, display default city information";
        } else {
          //x.innerHTML = innerText;
          displayWelcomeMessage (position.coords.latitude, position.coords.longitude, daysToTravel, defaultLocation);
        }
  }

  function displayWelcomeMessage (lat, lng, daysToTravel, defaultLocation) {

    getWeatherForecast(lat, lng, daysToTravel, 1)
    // userResponse = document.getElementById('feelings').value;
    // newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

    .then(function(data) {

      console.log("DATA COMMING FROM WEATHER BIT ON WELCOME SCREEN: ", data);
      getImageFromTravelPlace(data.name)

        .then( function(data) {

          console.log('This is the complete data APP side: ON WELCOME SCREEN', data);

            // //Add data to post request
            // postData('http://localhost:3000/add', {temperature: data.main.temp, date: newDate, userResponse: userResponse} )
            // .then(
            //     updateUI()
            // )
            
            if (!defaultLocation) {
              formatInnerHTMLString(data);
            } else {
              displayPlaceholderHTML(data)
            }

        })
    })

  }

  function formatInnerHTMLString (data) {
    let d = new Date();
    let newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();
      const validateElement = document.getElementById('search-top');
      validateElement.innerHTML = null;
      const innerHTMLString = 
            `<div class="results-nested">
            <div class="response-top-left box">
                <img class="center responsive" src=${data.imageInfo.imagesURL} alt="Italian Trulli">
            </div>
            <div class="response-top-rigth box">
            <div class="dtr-nested">
                <div id="dtr-top">
                    <div class="box" id="header-response">
                    <p>Current Location: ${data.cityName}
                    <br>Todays date: ${newDate}</p>
                    <!-- <br> -->
                    </div>
                </div>
                <div class="box" id="dtr-middle">
                    <button class="button-save" id="generate" type = "submit"> save trip </button>
                    <button class="button-save" id="save" type = "submit"> remove trip </button>
                </div>
                <div class="box" id="dtr-bottom">
                <br>
                <p>Welcome!
                <br> Please enter your Travel Date and City.</p>
                </div>
            </div>
            </div>

            <div class="response-bottom-left box">
                <p></p>
            </div>
            <div class="response-bottom-rigth box">
                <div class="box" id="dbr-top">
                <br>
                <p>Todays weather is: </p>
                </div>
                <div class="box" id="dbr-bottom">
                <p>High: ${data.maxTemp}, Low:${data.lowTemp}
                    <br> ${data.weatherDescription}
                </p>
                </div>
            </div>

        </div>`

        x.innerHTML = innerHTMLString;
  }

  function displayReesultsHTML (data) {
    let d = new Date();
    let newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();
    const validateElement = document.getElementById('search-top');
    validateElement.innerHTML = null;
      const innerHTMLString = 
            `<div class="results-nested">
            <div class="response-top-left box">
                <img class="center responsive" src=${data.imageInfo.imagesURL} alt="Italian Trulli">
            </div>
            <div class="response-top-rigth box">
            <div class="dtr-nested">
                <div id="dtr-top">
                    <div class="box" id="header-response">
                    <p>My trip to: ${data.weatherInfo.cityName}
                    <br>Departing on: ${data.travelDate}</p>
                    <!-- <br> -->
                    </div>
                </div>
                <div class="box" id="dtr-middle">
                    <button class="button-save" id="generate" type = "submit"> save trip </button>
                    <button class="button-save" id="save" type = "submit"> remove trip </button>
                </div>
                <div class="box" id="dtr-bottom">
                <br>
                <p>${data.name} is ${data.daysToTravel} days away!</p> 
                </div>
            </div>
            </div>

            <div class="response-bottom-left box">
                <p></p>
            </div>
            <div class="response-bottom-rigth box">
                <div class="box" id="dbr-top">
                <br>
                <p>${data.weatherInfo.returnText}:</p>
                </div>
                <div class="box" id="dbr-bottom">
                <p>High: ${data.weatherInfo.maxTemp}, Low:${data.weatherInfo.lowTemp}
                    <br> ${data.weatherInfo.weatherDescription}
                </p>
                </div>
            </div>

        </div>`

        x.innerHTML = innerHTMLString;
  }

  function displayPlaceholderHTML (data) {
    let d = new Date();
    let newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();
      const validateElement = document.getElementById('search-top');
      validateElement.innerHTML = null;
      const innerHTMLString = 
            `<div class="results-nested">
            <div class="response-top-left box">
                <img class="center responsive" src=${data.imageInfo.imagesURL} alt="Italian Trulli">
            </div>
            <div class="response-top-rigth box">
            <div class="dtr-nested">
                <div id="dtr-top">
                    <div class="box" id="header-response">
                    <p>It must be nice to be at: ${data.cityName}
                    <br>Todays date: ${newDate}</p>
                    <!-- <br> -->
                    </div>
                </div>
                <div class="box" id="dtr-middle">
                    <button class="button-save" id="generate" type = "submit"> save trip </button>
                    <button class="button-save" id="save" type = "submit"> remove trip </button>
                </div>
                <div class="box" id="dtr-bottom">
                <br>
                <p>Welcome!
                <br> Please enter your Travel Date and City.</p>
                </div>
            </div>
            </div>

            <div class="response-bottom-left box">
                <p></p>
            </div>
            <div class="response-bottom-rigth box">
                <div class="box" id="dbr-top">
                <br>
                <p>Todays weather is: </p>
                </div>
                <div class="box" id="dbr-bottom">
                <p>High: ${data.maxTemp}, Low:${data.lowTemp}
                    <br> ${data.weatherDescription}
                </p>
                </div>
            </div>

        </div>`

        x.innerHTML = innerHTMLString;
  }

  export { getLocation }
  export { displayReesultsHTML }
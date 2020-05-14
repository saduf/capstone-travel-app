import { getWeatherForecast } from './formHandler'
import { getImageFromTravelPlace } from './formHandler'

let x = '';
  
  // Method to display a picture in the welcome screen from the user location if geolocation is allowed.
  function getLocation() {
    x = document.getElementsByClassName("display-results")[0];
    console.log("This is x in getLocation: ", x);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, errorCallback,{timeout:5000});
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  // Display a picture from Hawai in the welcome screen if no geolocation is allowed.
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
    const innerText = `<p>Latitude: ${position.coords.latitude} <br>Longitude: ${position.coords.longitude} </p>`;
    console.log('innerText: ', innerText)
    const daysToTravel = 0;
    const defaultLocation = 0
    
    // Most probable is that we don't hit this part as errorCallback takes precedence, just in case.
    if (position.coords.latitude == null || position.coords.latitude == '' || 
        position.coords.longitude == null || position.coords.longitude == '') {
          console.log('LOCATION INFORMATION NOT ALLOWED');
          x.innerHTML = "Corridinates not found, display default city information";
        } else {
          // Display welcome screen with a picture from the user location.
          displayWelcomeMessage (position.coords.latitude, position.coords.longitude, daysToTravel, defaultLocation);
        }
  }

  function displayWelcomeMessage (lat, lng, daysToTravel, defaultLocation) {

    // Get the weather of the user location or the default if no geolocation is allowed.
    getWeatherForecast(lat, lng, daysToTravel, 0, 0, 1)
    .then(function(data) {
      getImageFromTravelPlace(data.name)
        .then( function(data) {
            if (!defaultLocation) {
              formatInnerHTMLString(data);
            } else {
              displayPlaceholderHTML(data)
            }
        })
    })

  }

  // This is the innerHTML to display the welcome screen if geolocation is allowed.
  function formatInnerHTMLString (data) {
    let d = new Date();
    let newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();
      const validateElement = document.getElementById('search-top');
      validateElement.innerHTML = null;
      const innerHTMLString = 
            `<div class="results-nested">
            <div class="response-top-left">
                <img class="center responsive" src=${data.imageInfo.imagesURL} alt="Italian Trulli">
            </div>
            <div class="response-top-rigth">
            <div class="dtr-nested">
                <div id="dtr-top">
                    <div id="header-response">
                    <p>Current Location: ${data.cityName}
                    <br>Todays date: ${newDate}</p>
                    <!-- <br> -->
                    </div>
                </div>
                <div id="dtr-middle">
                    <button class="button-save" id="generate" type = "submit"> save trip </button>
                    <button class="button-save" id="save" type = "submit"> remove trip </button>
                </div>
                <div id="dtr-bottom">
                <br>
                <p>Welcome!
                <br> Please enter your Travel Date and City.</p>
                </div>
            </div>
            </div>

            <div class="response-bottom-left">
                <p></p>
            </div>
            <div class="response-bottom-rigth">
                <div id="dbr-top">
                <br>
                <p>Todays weather is: </p>
                </div>
                <div id="dbr-bottom">
                <p>High: ${data.maxTemp} &#8304;F, Low:${data.lowTemp} &#8304;F
                    <br> ${data.weatherDescription}
                </p>
                </div>
            </div>

        </div>`

        x.innerHTML = innerHTMLString;
  }

  // This is the innerHTML to display after a successful search.
  function displayResultsHTML (data) {
    let d = new Date();
    let newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();
    const validateElement = document.getElementById('search-top');
    validateElement.innerHTML = null;
      const innerHTMLString = 
            `<div class="results-nested">
            <div class="response-top-left">
                <img class="center responsive" src=${data.imageInfo.imagesURL} alt="Italian Trulli">
            </div>
            <div class="response-top-rigth">
            <div class="dtr-nested">
                <div id="dtr-top">
                    <div id="header-response">
                    <p>My trip to: ${data.weatherInfo.cityName}
                    <br>Departing on: ${data.travelDate}</p>
                    <!-- <br> -->
                    </div>
                </div>
                <div id="dtr-middle">
                    <button class="button-save" id="generate" type = "submit"> save trip </button>
                    <button class="button-save" id="save" type = "submit"> remove trip </button>
                </div>
                <div id="dtr-bottom">
                <br>
                <p>${data.name} is ${data.daysToTravel} days away!</p> 
                </div>
            </div>
            </div>

            <div class="response-bottom-left">
                <p></p>
            </div>
            <div class="response-bottom-rigth">
                <div id="dbr-top">
                <br>
                <p>${data.weatherInfo.returnText}:</p>
                </div>
                <div id="dbr-bottom">
                <p>High: ${data.weatherInfo.maxTemp} &#8304;F, Low:${data.weatherInfo.lowTemp} &#8304;F
                    <br> ${data.weatherInfo.weatherDescription}
                </p>
                </div>
            </div>

        </div>`

        x.innerHTML = innerHTMLString;
  }

  // Use this method to display the welcome screen if not geolocation is allowed, e.g. Hawaii.
  function displayPlaceholderHTML (data) {
    let d = new Date();
    let newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();
      const validateElement = document.getElementById('search-top');
      validateElement.innerHTML = null;
      const innerHTMLString = 
            `<div class="results-nested">
            <div class="response-top-left">
                <img class="center responsive" src=${data.imageInfo.imagesURL} alt="Italian Trulli">
            </div>
            <div class="response-top-rigth">
            <div class="dtr-nested">
                <div id="dtr-top">
                    <div id="header-response">
                    <p>It must be nice to be at: ${data.cityName}
                    <br>Todays date: ${newDate}</p>
                    <!-- <br> -->
                    </div>
                </div>
                <div id="dtr-middle">
                    <button class="button-save" id="generate" type = "submit"> save trip </button>
                    <button class="button-save" id="save" type = "submit"> remove trip </button>
                </div>
                <div id="dtr-bottom">
                <br>
                <p>Welcome!
                <br> Please enter your Travel Date and City.</p>
                </div>
            </div>
            </div>

            <div class="response-bottom-left">
                <p></p>
            </div>
            <div class="response-bottom-rigth">
                <div id="dbr-top">
                <br>
                <p>Todays weather is: </p>
                </div>
                <div id="dbr-bottom">
                <p>High: ${data.maxTemp} &#8304;F, Low:${data.lowTemp} &#8304;F
                    <br> ${data.weatherDescription}
                </p>
                </div>
            </div>

        </div>`

        x.innerHTML = innerHTMLString;
  }

  export { getLocation, 
           displayResultsHTML,
           displayWelcomeMessage }
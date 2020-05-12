module.exports = {
    getWeatherIfInTravelWindow: function(weatherData, daysToTravel) {
        console.log('weatherData length: ', weatherData.length);
        console.log('Days to travel: ', daysToTravel);
        let tempRetVal = '';
        let retvalue = '';
        let returnMessage = '';

        if (daysToTravel < weatherData.length) {
            console.log("We can get the travel wether for the day of travel");
            console.log('Date of the travel: ', weatherData[daysToTravel]['valid_date']);
            tempRetVal = weatherData[daysToTravel];
            returnMessage = 'This is the weather forecast for the day you travel!';
            //retValue = weatherData[daysToTravel];
            retValue = {
                'returnText' : returnMessage,
                'weatherDescription' : tempRetVal['weather']['description'],
                'lowTemp' : tempRetVal['low_temp'],
                'maxTemp' : tempRetVal['max_temp']
            }
        } else {
            console.log("We will send the travel forecats for the 16th day, travel date is out of available forecast");
            returnMessage = 'Typical weather for the day you travel is:';
            //tempRetVal = weatherData[weatherData.length-1];
            retValue = {
                'returnText' : returnMessage,
                'weatherDescription' : `clouds: ${weatherData[0]['clouds']} , wind speed: ${weatherData[0]['wind_spd']} , 
                                        snow: ${weatherData[0]['snow']}, precipitation: ${weatherData[0]['precip']}`,
                'lowTemp' : weatherData[0]['min_temp'],
                'maxTemp' : weatherData[0]['max_temp']
            }
        }

        return retValue;
    }
};
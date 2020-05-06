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
        } else {
            console.log("We will send the travel forecats for the 16th day, travel date is out of available forecast");
            returnMessage = 'This is the weather forecast of the 16th day from today, please come back later to get an updated forecast as your date of travel approaches';
            tempRetVal = weatherData[weatherData.length-1];
        }

        retValue = {
            'returnText' : returnMessage,
            'weatherDescription' : tempRetVal['weather']['description'],
            'lowTemp' : tempRetVal['low_temp'],
            'maxTemp' : tempRetVal['max_temp']
        }

        return retValue;
    }
};
function dateValidation(travelDate) {

    // map to help with date from user input conversion.
    const monthsMap = { 'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
 }

    let daysToTravel = 0;

    let retValue = {
        'daysToTravel': daysToTravel,
        'start_date' : NaN,
        'end_date' : NaN
    }

    // Get current date to be used to calculate the days to travel.
    const d = new Date();
    const dateMonth = d.getMonth()+1;
    const dateDay = d.getDate();
    const dateYear = d.getFullYear();
    //console.log("Month-Day-Year: ", dateMonth + '.' + dateDay + '.' + dateYear)

    //console.log("The month is: ", travelDate["4"] + travelDate["5"] + travelDate["6"]);
    // Convert user input date to format needed to calculate days to travel.
    const monthString = travelDate["4"] + travelDate["5"] + travelDate["6"];
    const dayString = travelDate["8"] + travelDate["9"];
    const yearString = travelDate["11"] + travelDate["12"] + travelDate["13"] + travelDate["14"];
    const monthsInt = monthsMap[monthString];


    if ( yearString < dateYear) {
        console.log("Invalid date, we cannot travel to the past");
    } else if (yearString == dateYear &&  monthsInt < dateMonth) {
        console.log("Invalid date, we cannot travel to the past2");
    } else if (yearString == dateYear &&  monthsInt == dateMonth && dayString < dateDay) {
        console.log("Invalid date, we cannot travel to the past3");
    } else {
        if (((yearString - dateYear) >= 1) && ((monthsInt - dateMonth) >= 1)) {
            console.log("Booking more than one year in advance, please come back later when your trip is closer");
        } else {

            // This is a valid date, lets get days to travel, start_date and end_date for wetaher history or forecast.
            const currentDate = dateMonth + "/" + dateDay + "/" + dateYear;
            const travelDateNew =  monthsInt + "/" + dayString + "/" + yearString;
            
            // console.log("CurrentDate: ", currentDate);
            // console.log("Travel Date: ", travelDateNew);

            let dateTemp = new Date(yearString, monthsInt-1, dayString);
            dateTemp.setDate(dateTemp.getDate()-1);

            // Get days to travel from current date.
            daysToTravel = datediff(parseDate(currentDate), parseDate(travelDateNew));
            
            retValue['daysToTravel'] = daysToTravel;

            // If date to travel is more than 16 days away, get start and end date to request history to weather API.
            if (daysToTravel > 16) {
                // Obtain end date to look for historic weather data.
                const tempMonth = '' + (parseInt(dateTemp.getMonth())+1);
                const month = tempMonth.length == 1 ? 0 + tempMonth : tempMonth;
                

                const start_date = ('' + (parseInt(dateTemp.getFullYear())-1)) + "-" + month + "-" + dateTemp.getDate();
                const end_date = ('' + (parseInt(yearString)-1)) + "-" + monthsInt + "-" + dayString;

                retValue['start_date'] = start_date;
                retValue['end_date'] = end_date;
            }
        }
    }
    return retValue;
}

// new Date("dateString") is browser-dependent and discouraged, so we'll write
// a simple parse function for U.S. date format (which does no error checking)
function parseDate(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[0]-1, mdy[1]);
}

function datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
}

export { dateValidation }

function dateValidation(travelDate) {

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

    let daysToTravel = 0;

    const d = new Date();
    const dateMonth = d.getMonth()+1;
    const dateDay = d.getDate();
    const dateYear = d.getFullYear();
    console.log("Month-Day-Year: ", dateMonth + '.' + dateDay + '.' + dateYear)

    console.log("The month is: ", travelDate["4"] + travelDate["5"] + travelDate["6"]);
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
            const currentDate = dateMonth + "/" + dateDay + "/" + dateYear;
            const travelDateNew =  monthsInt + "/" + dayString + "/" + yearString;
            console.log("CurrentDate: ", currentDate);
            console.log("Travel Date: ", travelDateNew);

            daysToTravel = datediff(parseDate(currentDate), parseDate(travelDateNew));
        }

    }

    return daysToTravel;
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

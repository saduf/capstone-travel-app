function dateValidation(travelDate) {
    const d = new Date();
    const dateMonth = d.getMonth()+1;
    const dateDay = d.getDate();
    const dateYear = d.getFullYear();
    console.log("Month-Day-Year: ", dateMonth + '.' + dateDay + '.' + dateYear)

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
    const daysMap = {   '1': 31,
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

    console.log("The travel date is: ", travelDate);
    console.log("The travel date 1 is: ", travelDate["0"]);
    console.log("The travel date 2 is: ", travelDate["1"]);
    console.log("The travel date 3 is: ", travelDate["2"]);
    console.log("The travel date 4 is: ", travelDate["3"]);
    console.log("The month is: ", travelDate["4"] + travelDate["5"] + travelDate["6"]);
    const monthString = travelDate["4"] + travelDate["5"] + travelDate["6"];
    const dayString = travelDate["8"] + travelDate["9"];
    const yearString = travelDate["11"] + travelDate["12"] + travelDate["13"] + travelDate["14"];
    const monthsInt = monthsMap[monthString];
    console.log("The month translate to int: " + monthsMap[monthString]);
    console.log("Days in month: ", daysMap[monthsInt]);
    console.log("Days string is: ", dayString);
    console.log("Year string is: ", yearString);

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
            console.log("VALID DATE");
        }

    }

    
    //return retValue;
}

export { dateValidation }

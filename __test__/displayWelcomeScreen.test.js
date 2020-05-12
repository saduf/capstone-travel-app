import { displayWelcomeMessage } from '../src/client/js/displayWelcomeScreen'
import { dateValidation } from '../src/client/js/validateData'

// test('Testing welcome message', () => {
//     const defaultLat = 19.741755;
//     const defaultLon = -155.844437;
//     const defaultLocation = 1;
//     const daysToTravel = 0;
//     return displayWelcomeMessage(defaultLat, defaultLon, daysToTravel, defaultLocation).then(data => {
//       expect(data).toBe('positive');
//     });
//   });


  test('Validate travel date, not in the past, not the same day, not 1 year away', () => {
    const retValue = displayWelcomeMessage(defaultLat, defaultLon, daysToTravel, defaultLocation);
    expect(retValue.daysToTravel).toBe(0);
  });
import { getGeoResponse } from '../src/client/js/formHandler'
test('Testing server side getGeoResponse method', () => {

  const cityName = 'Boston';
  const travelDate = 'Thu Jul 23 2020';
  const daysToTravel = '12'

  return getGeoResponse(cityName, daysToTravel, travelDate).then(data => {
    expect(data.countryName).toBe('United States');
  });
});
import { getGeoResponse } from '../src/client/js/formHandler'
//const formHan = require('../formHandler');

test('Testing server side', () => {

  document.body.innerHTML = document.body.innerHTML = '<div class="box" id="search-bottom"><button class="button-search" id="generate" type = "submit"> save trip </button><button class="button-search" id="save" type = "submit"> remove trip </button></div>';
  
  var ev = document.createEvent('Events');
  ev.initEvent('click', true, false);
  //el.dispatchEvent(evObj);
  
  //const ev = document.getElementById('submit-btn').click();
  console.log("Event" + ev);
  //const ev = document.querySelector('submit').click();

  const cityName = 'Boston';
  const travelDate = 'Thu Jul 23 2020';
  const daysToTravel = '12'

  return getGeoResponse(cityName, daysToTravel, travelDate).then(data => {
    expect(data.countryName).toBe('United States');
  });
});
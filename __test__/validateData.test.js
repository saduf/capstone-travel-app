import { dateValidation } from '../src/client/js/validateData'

test('Validate travel date, not in the past, not the same day, not 1 year away', () => {
    const retValue = dateValidation('Fri Jun 25 2021');
    expect(retValue.daysToTravel).toBe(0);
  });

  test('Validate travel date, not in the past, not the same day, not 1 year away', () => {
    const retValue = dateValidation('Fri Dec 25 2020');
    expect(retValue.daysToTravel > 0).toBe(true);
  });

  test('Validate travel date, not in the past, not the same day, not 1 year away', () => {
    const retValue = dateValidation('Fri Dec 25 2020');
    expect(retValue.end_date).toBe('2019-12-25');
  });
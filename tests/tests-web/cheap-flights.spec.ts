import { test, expect } from './fixtures'
import { SearchPage } from './pages/SearchPage';
import TestData from './test-data/search-flight-test-data.json'
import {tripTypeName} from "./helper/titleHelper"
test.describe('Cheapflights Web Testing', () => {
  test('Verify the header logo and sign-up for Google and Email', async ({ page }) => {
    await page.goto('https://www.cheapflights.com/');

    await expect(page.locator('header .gPDR-logo-image')).toBeVisible();
    await expect(page.getByLabel('Sign in')).toBeVisible();
    await page.getByLabel('Sign in').click();
    await expect(page.getByRole('button', { name: 'Google' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue with email' })).toBeVisible();
  });





  TestData.forEach((data,index) => {
  const tripTitle = tripTypeName(data.returnDate ?? "");
    test(`[test-${index+1}] Search Flight for ${tripTitle}`, async ({ page, homePage }) => {
      // const countryOrigin = "Manila"
      // const countryDestination = "Singapore"
      // const originAirport = 'Ninoy Aquino Intl';
      // const destinationAirport = 'Changi';
      // const rawDepartureDate = new Date("2027, 6, 1");
      // const rawReturnDate = new Date("2027, 8, 2");
      // const totalAdult = 3;
      // const totalInfant = 3
      // const totalChildren = ['2', '1', '2']
      // const cabinClass = 'Premium Economy'

      console.log("Children Age : ", data.totalChildren.length)
      const totalpassenger = (data.totalChildren.length + data.totalAdult + data.totalInfant)



      //Tue 6/1
      console.log("get total passenger:", totalpassenger)


      let formatReturnDate: string | undefined;
      const departureDate = new Date(data.departureDate)
        .toLocaleDateString('en-us');

      const returnDate = data.returnDate ? new Date(data.returnDate ?? "")
        .toLocaleDateString('en-us'):"";

      console.log(departureDate); 
      console.log(returnDate);  

      await page.pause();
      const formatDepartureDate = await homePage.datePickerConstructor(departureDate);
      let tripType;
      if (!data.returnDate) {
        tripType = 'One-way';
      }
      else {
        tripType = 'Round-trip';
        formatReturnDate = await homePage.datePickerConstructor(returnDate);
      }
      await homePage.gotoCheapflights();
      await page.getByRole('combobox', { name: 'Round-trip' }).click();
      await page.getByRole('option', { name: tripType }).click();
      await homePage.setOrigin(data.originAirport);
      await homePage.setDestination(data.destinationAirport);

      if (tripType === 'Round-trip') {
        if (!formatReturnDate) {
          throw new Error('No Format Return Date');
        }

        await homePage.selectDepartureDateAndReturnDate(formatDepartureDate, formatReturnDate);
      }

      else if (tripType === 'One-way') {
        await page.getByRole('button', { name: 'Departure' }).click();
        await homePage.datePicker(formatDepartureDate);
      }
      else {
        throw new Error('Invalid trip type');
      }

      await homePage.setTotalPassengers(data.totalAdult, data.totalInfant, data.totalChildren);
      await homePage.selectCabinClass(data.cabinClass).click();

      const newTab: SearchPage = await homePage.validateSearchOptionsButtons();

      await newTab.validateBestOfferFlightDetails(data.originAirport, data.destinationAirport, data.countryOrigin, data.countryDestination, totalpassenger, departureDate, returnDate);

      //getByRole('button', { name: 'Flight origin input Manila' })
      // await newTab.validateCheapestOffer();
      // await newTab.validateQuickestOffer();





    });
  });



  //Multi-city Test Case for future implementation

  test('Verify Search Missing Destination Error Message', async ({ page, homePage }) => {
    await homePage.gotoCheapflights();
    await homePage.searchButton.click();
    await expect(page.getByText('Please describe your destination or enter an airport')).toBeVisible();
    await page.pause();
  })
  test('Verify Disabled Calendar Picker Arrow during 12th Click', async ({ page, homePage }) => {
    await homePage.gotoCheapflights();
    await homePage.validateDisabledDatePicker();
  })




});



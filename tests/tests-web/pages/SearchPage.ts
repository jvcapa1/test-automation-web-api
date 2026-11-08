import { Locator, Page, expect } from "@playwright/test";
import { format } from "node:path";
export class SearchPage {
    cheapestButton: Locator;
    bestButton: Locator;
    quickestButton: Locator;
    page: Page;
    header: Locator;
    constructor(page: Page) {
        this.page = page;
        this.cheapestButton = page.getByRole('button', { name: 'Cheapest' })
        this.bestButton = page.getByRole('button', { name: 'Best', exact: true })
        this.quickestButton = page.getByRole('button', { name: 'Quickest' })
        this.header = page.locator('header')
    }

    async convertToDate(date:String):Promise<Date>{
        const [rawmonth, rawday, rawyear] = date.split('/').map(Number);
        const dateFormat = new Date(rawyear, rawmonth - 1, rawday);
        return dateFormat;


    }


    async validateBestOfferFlightDetails(origin: string,destination: string,countryOrigin: string, countryDestination: string,totalpassenger: number,rawDepartureDate: string,rawReturnDate: string | "") {
        const departureDate= await this.convertToDate(rawDepartureDate)
        const dayName = departureDate.toLocaleDateString('en-US', {weekday: 'short'});
        const month = departureDate.toLocaleDateString('en-US', {month: 'numeric'});
        const day = departureDate.toLocaleDateString('en-US', {day: 'numeric'});

        const originFormateDayDate = `${dayName} ${month}/${day}`;

        const resultCard = this.page.getByRole('group', {name: 'Result item 1',exact: true});
        console.log("Result Card Text: ",await resultCard.textContent())
        await expect(resultCard).toContainText(origin);
        await expect(resultCard).toContainText(destination);



        const originField = this.header.getByLabel('Flight origin input', { exact: true }).getByLabel(countryOrigin).nth(0);

        await expect(originField).toBeVisible();

        const destinationField = this.header.getByLabel('Flight destination input', { exact: true }).getByLabel(countryDestination).nth(0);

        await expect(destinationField).toBeVisible();

        if (!rawReturnDate) {
            console.log('One-way Scenario Steps')

            const headerFlightType = this.header.getByRole('button', {
                name: 'One-way'
            });

            await expect(headerFlightType).toBeVisible();
            const departureField = this.header.getByLabel(`Departure date ${originFormateDayDate}`, { exact: true }).nth(0);

            await expect(departureField).toBeVisible();

        } else {
            console.log('Return Scenario Steps')
            const headerFlightType = this.header.getByRole('button', { name: 'Round-trip' });

            await expect(headerFlightType).toBeVisible();

            const returneDate= await this.convertToDate(rawReturnDate)
            const returnDayName = returneDate.toLocaleDateString('en-US', {
                weekday: 'short'
            });

            const returnMonth = returneDate.toLocaleDateString('en-US', {
                month: 'numeric'
            });

            const returnDay = returneDate.toLocaleDateString('en-US', { day: 'numeric' });

            const returnFormateDayDate = `${returnDayName} ${returnMonth}/${returnDay}`;

            const returnField = this.header.getByLabel(`Departure date ${originFormateDayDate} – ${returnFormateDayDate}`, { exact: true }).nth(0);

            await expect(returnField).toBeVisible();
        }

        const totalPeople = this.header.getByRole('button', { name: String(totalpassenger), exact: true });
        await expect(totalPeople).toBeVisible();
    }


}

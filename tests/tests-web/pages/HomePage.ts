import { SearchPage } from "./SearchPage";
import { Page, Locator, expect } from "@playwright/test"
export class HomePage {
    page: Page;
    adultSection: Locator;
    incrementAdults: Locator;
    decrementAdults: Locator;
    infantSection: Locator;
    incrementInfant: Locator;
    decrementInfant: Locator;
    childrenSection: Locator;
    incrementChildren: Locator;
    decrementChildren: Locator;
    originComboBox: Locator;
    destinationComboBox: Locator;
    removeDestinationValue: Locator;
    childrenTitle: Locator;
    searchButton: Locator;
    selectCabinClass: (cabinClass: string) => Locator;
    nextMonth: Locator;

    constructor(page: Page) {
        this.page = page;
        this.originComboBox = page.getByRole('combobox', { name: 'Origin location' });
        this.destinationComboBox = page.getByRole('combobox', { name: 'Ask anything' });
        this.removeDestinationValue = page.getByRole('button', { name: 'Remove value' });
        this.childrenTitle = this.page.getByText("Child's age");
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.adultSection = page.getByText('Adults18+').locator('..');
        this.infantSection = page.getByText('Infants on lapunder').locator('..');
        this.childrenSection = page.getByText('Children0-').locator('..');
        this.nextMonth = this.page.getByRole('button', { name: 'Next Month' })
        this.incrementAdults = this.adultSection.getByRole('button', {
            name: 'Increment'
        });
        this.decrementAdults = this.adultSection.getByRole('button', {
            name: 'Decrement'
        });
        // this.adultsContainer = page.locator('.FkqV-inner')
        this.incrementInfant = this.infantSection.getByRole('button', {
            name: 'Increment'
        });
        this.decrementInfant = this.infantSection.getByRole('button', {
            name: 'Decrement'
        });
        this.incrementChildren = this.childrenSection.getByRole('button', {
            name: 'Increment'
        });
        this.decrementChildren = this.childrenSection.getByRole('button', {
            name: 'Decrement'
        });
        this.selectCabinClass = (cabinClass: string) => this.page.getByRole('radio', { name: cabinClass });
    }


    async setOrigin(origin: string) {
        await this.removeDestinationValue.click();
        await this.originComboBox.fill(origin);
        await this.page.getByText(origin).click();
        // .getByRole('option', { name: origin }).click();
    }

    async setDestination(destination: string) {
        await this.destinationComboBox.fill(destination);
        await this.page.getByText(destination).click();
    }


    async selectDepartureDateAndReturnDate(departureDate: string, returnDate: string) {
        await this.page.getByRole('button', { name: 'Departure  -  Return' }).click();
        await this.datePicker(departureDate);
        await this.datePicker(returnDate);
    }

    async gotoCheapflights() {
        await this.page.goto('https://www.cheapflights.com/');
    }


    async datePicker(date: string) {
        const datePicker = this.page.getByRole('button', {
            name: date,
        });
        let found = false
        for (let counter = 0; counter < 12; counter++) {
            console.log("counter: ", counter)
            if (await datePicker.isVisible()) {
                found = true;
                await datePicker.click();
                break;
            }
            await this.nextMonth.click();
        }
        if (!found) throw new Error('Departure date was not found!');
    }

    async validateDisabledDatePicker() {
        await this.page.getByRole('button', { name: 'Departure  -  Return' }).click();

        for (let counter = 1; counter < 12; counter++) {
            console.log("counter: ", counter)
            await this.nextMonth.click();
        }
        expect(this.nextMonth).toHaveAttribute('aria-disabled', 'true')

    }


    async datePickerConstructor(rawDate: string): Promise<string> {
        const [rawmonth, rawday, rawyear] = rawDate.split('/').map(Number);
            const date = new Date(rawyear, rawmonth - 1, rawday);


        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        console.log('Day Name: ', dayName);
        const monthName = new Date(date).toLocaleDateString('en-US', { month: 'long' });
        console.log('Month Name: ', monthName);
        const year = new Date(date).toLocaleDateString('en-US', { year: 'numeric' });
        console.log('Year: ', year);
        const day = new Date(date).toLocaleDateString('en-US', { day: 'numeric' });
        console.log('day', day);
        const formatDate = `${dayName}, ${monthName} ${day}, ${year}`;
        console.log('constructor date: ', formatDate);
        return formatDate;
    }


    async setTotalPassengers(totalAdult: number, totalInfant: number, totalChildren: string[]) {

        for (let c = 1; c < totalAdult; c++) {
            await this.incrementAdults.click();
        }

        for (let c = 0; c < totalInfant; c++) {
            await this.incrementInfant.click();
        }

        for (let [count, childAge] of totalChildren.entries()) {
            await this.incrementChildren.click();
            const ageDropdown = this.childrenTitle.nth(count).locator('../..').getByRole('combobox');
            await ageDropdown.click();
            const ageOption = this.page.getByRole('option', { name: childAge, exact: true })
            await this.page.waitForTimeout(2000);
            await expect(ageOption).toBeVisible();
            await ageOption.click();
        }
    }

    async validateSearchOptionsButtons() {
        const waitForNewPage = this.page.context().waitForEvent('page');
        await this.searchButton.click();
        const newPage = await waitForNewPage;
        const searchPage = new SearchPage(newPage);
        await expect(newPage.getByRole('button', { name: 'Cheapest' })).toBeVisible();
        await expect(newPage.getByRole('button', { name: 'Best', exact: true })).toBeVisible();
        await expect(newPage.getByRole('button', { name: 'Quickest' })).toBeVisible();
        return searchPage;
    }


}
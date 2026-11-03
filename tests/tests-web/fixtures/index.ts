import { test as base,APIRequestContext } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';

type Fixtures = {
    homePage: HomePage;
    searchPage: SearchPage;
    bookerToken:string;
};

export const test = base.extend<Fixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    searchPage: async ({ page }, use) => {
        await use(new SearchPage(page));
    },
    bookerToken:async({request},use)=>{
    
    },
});
export { expect } from '@playwright/test';
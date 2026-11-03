import 'dotenv/config';
import { request, FullConfig,expect } from '@playwright/test';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
    console.log('Creating Booker Token')
    const apiContext = await request.newContext({
        baseURL: 'https://restful-booker.herokuapp.com'
    });
    const username =process.env.uname ;
    const password = process.env.password;


    const response = await apiContext.post('/auth', {
        data: {
            username: username ,
            password: password
        }
    });

    expect(response.ok()).toBeTruthy();
  

    const reqBody = await response.json();

    process.env.booker_token =reqBody.token;
        console.log('done! global setup!')


}

export default globalSetup;
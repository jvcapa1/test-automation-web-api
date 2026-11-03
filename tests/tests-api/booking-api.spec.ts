import { test, expect } from "@playwright/test"
import { BookerApi } from './api/BookerApi';
import CreateTestData from './test-data/create-details.json'
import UpdateTestData from './test-data/update-details.json'
import DeleteTestData from './test-data/delete-id.json'

test.describe('API Testing', () => {




CreateTestData.forEach((data,index)=>{
    test(`${index+1}Create Booking and validate`, async ({ request }) => {

        const bookerApi = await BookerApi.getContext();
        const createdID = await bookerApi.createUserAndGetID(data.createdDetails);
        console.log('createdID:', createdID);
        const getBookerBody = await bookerApi.getBookerByID(createdID);
        console.log('BookerGet:', getBookerBody);
        expect(getBookerBody).toMatchObject(data.createdDetails);

    })
});


UpdateTestData.forEach((data,index)=>{
    test(`${index+1} Update and Validate`, async ({ request }) => {
        const bookerApi = await BookerApi.getContext();


        // const updateDetail = {
        //     "UpdateID": "1383",
        //     "BookerGet": {
        //         "firstname": "James",
        //         "lastname": "Brown",
        //         "totalprice": 111,
        //         "depositpaid": true,
        //         "bookingdates": {
        //             "checkin": "2018-01-01",
        //             "checkout": "2019-01-01"
        //         },
        //         "additionalneeds": "Breakfast"
        //     }
        // }

        await bookerApi.UpdateBookerByID(data.updateDetail);

        const getBookerBody = await bookerApi.getBookerByID(data.updateDetail.UpdateID);
        console.log('BookerGet:', getBookerBody);
        expect(getBookerBody).toMatchObject(data.updateDetail.BookerGet);
    })
});
DeleteTestData.forEach((data) => {

    test(`Delete Booker ID: ${data}`, async ({ request }) => {
        const bookerApi = await BookerApi.getContext();
        await bookerApi.deleteByID(String(data));
        await bookerApi.validateDeletedID(String(data));
    });
});

})
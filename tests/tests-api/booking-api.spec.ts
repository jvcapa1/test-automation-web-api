import { test, expect } from "@playwright/test"
import { BookerApi } from './api/BookerApi';
import CreateTestData from './test-data/create-details.json'
import UpdateTestData from './test-data/update-details.json'
import DeleteTestData from './test-data/delete-id.json'
import DataTypeData from "./test-data/data-type-scenario.json"
import nullFields from "./test-data/null-fields.json"


test.describe('API Testing', () => {




    CreateTestData.forEach((data, index) => {
        test(`${index + 1}Create Booking and validate`, async ({ request }) => {

            const bookerApi = await BookerApi.getContext();
            const createdID = await bookerApi.createUserAndGetID(data.createdDetails);
            console.log('createdID:', createdID);
            const getBookerBody = await bookerApi.getBookerByID(createdID);
            console.log('BookerGet:', getBookerBody);
            expect(getBookerBody).toMatchObject(data.createdDetails);

        })
    });


    UpdateTestData.forEach((data, index) => {
        test(`${index + 1} Update and Validate`, async ({ request }) => {
            const bookerApi = await BookerApi.getContext();


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


    DataTypeData.forEach((data, index) => {
        test(`${index + 1} Validate API Body Data Type`, async ({ request }) => {
            const bookerApi = await BookerApi.getContext();
            const createdID = await bookerApi.createUserAndGetID(data.createdDetails);
            console.log('createdID:', createdID);
            const getBookerBody = await bookerApi.getBookerByID(createdID);
            console.log('BookerGet:', getBookerBody);
            expect(typeof getBookerBody.firstname).toEqual('string');
            expect(typeof getBookerBody.lastname).toEqual('string');
            expect(typeof getBookerBody.totalprice).toEqual('number');
            expect(typeof getBookerBody.depositpaid).toEqual('boolean');
            expect(typeof getBookerBody.bookingdates.checkin).toEqual('string');
            expect(typeof getBookerBody.bookingdates.checkout).toEqual('string');
            expect(typeof getBookerBody.additionalneeds).toEqual('string');

        })
    });

       nullFields.forEach((data, index) => {
        test(`${index + 1} Verify Unable to create a Null Field Values`, async ({ request }) => {
            const bookerApi = await BookerApi.getContext();
            const createdID = await bookerApi.validateNullFieldHandling(data.createdDetails);
            console.log('createdID:', createdID);
       
        })
    });



})
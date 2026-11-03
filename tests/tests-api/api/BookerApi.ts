import { request, APIRequestContext, expect } from '@playwright/test';

export class BookerApi {


    constructor(private reqContext: APIRequestContext) { }

    static async getContext() {
        const context = await request.newContext({
            baseURL: 'https://restful-booker.herokuapp.com'
        });

        return new BookerApi(context);
    }

    async createUserAndGetID(payload: object) {
        const response = await this.reqContext.post('/booking', {
            data: payload
        });

        expect(response.ok()).toBeTruthy();

        const responseBody = await response.json();

        return responseBody.bookingid;
    }
    async getBookerByID(createdID: string) {
        const response = await this.reqContext.get(`https://restful-booker.herokuapp.com/booking/${createdID}`);
        console.log('Booking ID:', createdID);
        console.log('GET Status:', response.status());
        console.log('GET Response:', await response.text());
        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();
        console.log("BookerGet:", responseBody)
        return responseBody;
    }
    async UpdateBookerByID(updateDetail: Booker) {
        const reqUpdate = await this.reqContext.put(`https://restful-booker.herokuapp.com/booking/${updateDetail.UpdateID}`, {
             headers: {
                'Cookie': `token=${process.env.booker_token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: updateDetail.BookerGet
        });
        console.log('Update Response Status:', reqUpdate.status());
        console.log('Update Response:', await reqUpdate.text());

        expect(reqUpdate.ok()).toBeTruthy();
        console.log("Update Res:", await reqUpdate.json())
    }
    async deleteByID(id: string) {
        const response = await this.reqContext.delete(`https://restful-booker.herokuapp.com/booking/${id}`, {
            headers: {
                'Cookie': `token=${process.env.booker_token}`,
            }

        });
        console.log('Delete Response Status:', response.status());
        console.log('Delete Response:', await response.text());

        expect(response.ok()).toBeTruthy();


    }

    async validateDeletedID(createdID: string) {

        const response = await this.reqContext.get(`https://restful-booker.herokuapp.com/booking/${createdID}`);
        expect(response.status()).toBe(404);

    }




}


export interface Booker {
    UpdateID?: string;
    createdID?: string
    BookerGet: {
        firstname: string;
        lastname: string;
        totalprice: number;
        depositpaid: boolean;
        bookingdates: {
            checkin: string;
            checkout: string;
        }
        additionalneeds: string;
    }
}
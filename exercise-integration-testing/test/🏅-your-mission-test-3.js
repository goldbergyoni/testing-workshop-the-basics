// 🏅 Your mission is to create your first integration tests here 💜
// ✅ Whenever you see this icon, there's a TASK for you
// 💡 - This is an ADVICE symbol, it will appear nearby most tasks and help you in fulfilling the tasks

// When emitting a new event -> if temperature exceeds 30 degree & sensor category is 'kids-room' -> send notification
// When trying to get 50 sensors -> our DB stands to the mission and return all of them
// Multiple files, teardown, Structure by describes
// Advanced: Unique name, 
// Advanced: When adding 3 and asking to sort, they are returned in the right order
// Delete a sensor, deletes all its events

//💰 Few words from your CFO, we will reward you (Bonus!) if you will:
//1. Test that email is sent when the temp is too high. This logic is implemented within the file - sensors-queue-subscriber. It might a bit challenging
//because it's invoked using a message-queue (not API)
//Reading exercise  

const request = require("supertest");
const express = require("express");
const apiUnderTest = require("../sensors-api");
const nock = require("nock");

let expressApp, expressConnection;

beforeAll(() => {
    expressApp = express();
    expressConnection = expressApp.listen(); //no port specified
    apiUnderTest(expressApp);
});

afterAll(() => {
    expressConnection.close();
})

describe.skip('Sensors test', () => {

    // ✅ TASK: Test that when a new event is posted to /event route, if category or temperature are not specified -> the API returns HTTP 400
    // 💡 TIP: Down below, there is an example event schema
    test('When category is not specified, should get http 400 error', () => {
        //Arrange
        const eventToAdd = {
            category: 'kids-room',
            temperature: 20,
            manufacturer: "samsung",
            longtitude: 80,
            latitude: 120,
            name: 'Thermostat-temperature', //This must be unique
            color: 'Green',
            weight: "80 gram",
            status: "active"
        };

        //Act
        //use any http client lib like supertest

        //Assert
        //verify that status is 400
    });

    // ✅ TASK: Test that when a new event is posted to /event route, if category or temperature are not specified -> the event is NOT saved to the DB!
    // 💡 TIP: Testing the response is not enough, the adequate state (e.g. DB) should also satisfy the expectation

    // ✅ TASK: Test that when a new valid event is posted to /event route, we get back a valid response
    // 💡 TIP: Consider both the HTTP status and the body

    // ✅ TASK: Test that when a new valid event is posted to /event route, it's indeed retrievable from the DB
    // 💡 TIP: Whenever possible, use the public API for verification

    // ✅ TASK: Test that when a new valid event is posted to /event route, if the temperature exceeds 50 degree a notification is being sent
    // 💡 TIP: Down below, there is an example event schema
});
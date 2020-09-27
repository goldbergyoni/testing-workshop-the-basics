// 👿 Few words from your product manager, we want to test the sensors component:
// When emitting a new event -> if category or temperature are not specified -> return 400
// When emitting a new event -> if temperature exceeds 50 degree -> send notification
// When emitting a new event -> if temperature exceeds 30 degree & sensor category is 'kids-room' -> send notification
// When trying to get 50 sensors -> our DB stands to the mission and return all of them

//💰 Few words from your CFO, we will reward you (Bonus!) if you will:
//1. Test that the operation 'notifyOnStaleSensors' sends notification successfully. It might a bit challenging
//because it's invoked using a message-queue (not API)

// 🧚‍ Few words from your architect: remember that this is a component test, we want to test EVERYTHING
//as long as it belongs to the sensors Microservice. Take a look at this lib - it might ease to shorten
//your assertions https://github.com/jest-community/jest-extended

test.todo("Test it 👆🏽");

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

beforeEach(() => {
  nock("http://localhost").get("/notification").reply(200, {
    success: true,
  });
});

afterAll(() => {
  expressConnection.close();
});

describe("Order API #component", () => {
  describe("POST /event", () => {
    test("When a temperature is beyond 50, then expects a notification to be sent", async () => {
      //Arrange
      const highTemperatureEvent = {
        category: "kids-room",
        temperature: 70,
        longtitude: 80,
        latitude: 120,
        name: "Thermostat",
        weight: "80 gram",
        status: "active",
      };

      //Act
      await request(expressApp).post("/sensor-events").send(highTemperatureEvent);

      //Assert
      //expect(nockRecord.isDone()).toBe(true);
    });

    test("When sorting by name, then results are sorted properly", async () => {
      // Arrange
      const secondEvent = {
        category: "unique-category-for-sort",
        temperature: 70,
        name: "def-this-should-come-second",
        weight: "80 gram",
        status: "active",
      };
      const firstEvent = {
        category: "unique-category-for-sort",
        temperature: 70,
        name: "abc-this-should-come-first",
        weight: "80 gram",
        status: "active",
      };
      await request(expressApp).post("/sensor-events").send(secondEvent);
      await request(expressApp).post("/sensor-events").send(firstEvent);

      // Act
      const receivedResult = await request(expressApp).get("/sensor-events/unique-category-for-sort/name");

      // Assert
      expect(receivedResult.body).toMatchObject([firstEvent, secondEvent]);
    });
  });
});

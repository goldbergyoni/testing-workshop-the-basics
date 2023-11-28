// 🏅 Your mission is to create your first integration tests here 💜
// ✅ Whenever you see this icon, there's a TASK for you
// 💡 - This is an ADVICE symbol, it will appear nearby most tasks and help you in fulfilling the tasks

const request = require("supertest");
const { initializeAPI, stopServer } = require("../sensors-api");
const {
  toIncludeAllPartialMembers,
  toBeArrayOfSize,
} = require("jest-extended");

expect.extend({ toIncludeAllPartialMembers, toBeArrayOfSize });

const nock = require("nock");

let expressApp;

beforeAll(() => {
  expressApp = initializeAPI();
});


afterAll(async () => {
  await stopServer();
});

afterEach(async () => {
  nock.cleanAll();
});

beforeEach(() => {
  // 📗 Reading exercise: Why is this needed 👇? Read about npm/nock
  nock("http://localhost").get("/notification").reply(200, {
    success: true,
  });
});

describe("Sensors test", () => {
  describe("/api", () => {
    describe("/sensor-events", () => {
      describe("/POST", () => {
        // ✅ TASK: Test that when a new event is posted to /event route, if category or temperature are not specified -> the API returns HTTP 400
        // 💡 TIP: Down below, there is an example event schema
        test("When category is not specified, should get http 400 error", async () => {
          //Arrange
          const temperatureLessEventToAdd = {
            temperature: undefined,
            name: "Thermostat-temperature", //This must be unique
            color: "Green",
            weight: "80 gram",
            status: "active",
            // 💡 TIP: Consider explicitly specify that category is undefined
          };
          //Act
          // 💡 TIP: use any http client lib like Axios OR supertest
          // 💡 TIP: This is how it is done with Supertest -> await request(expressApp).post("/sensor-events").send(eventToAdd);
          const receivedResponse = await request(expressApp).post("/sensor-events").send(temperatureLessEventToAdd);
          //Assert
          // 💡 TIP: verify that status is 400
          expect(receivedResponse.status).toBe(400);
        });

        // ✅ TASK: Test that when a new event is posted to /sensor-events route, the temperature is not specified -> the event is NOT saved to the DB!
        // 💡 TIP: Testing the response is not enough, the adequate state (e.g. DB) should also satisfy the expectation
        test("When event sent without tempature, Then its not saved to the db", async () => {
          //Arrange
          const temperatureLessEventToAdd = {
            temperature: undefined,
            name: "Thermostat-temperature",
            color: "Green",
            weight: "80 gram",
            status: "active",
            category: "temperature-less-event"
          };
          //Act
          await request(expressApp).post("/sensor-events").send(temperatureLessEventToAdd);
          //Assert
          const temperatureLessEvents = await request(expressApp).get("/sensor-events/temperature-less-event/name");
          expect(temperatureLessEvents.body).toBeArrayOfSize(0);
        });

        // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, we get back a valid response
        // 💡 TIP: Consider both the HTTP status and the body
        test("When valid event sent, Then we get back valid response", async () => {
          //Arrange
          const validEventToAdd = {
            temperature: 20,
            name: "Thermostat-temperature-valid",
            color: "Green",
            weight: "80 gram",
            status: "active",
            category: "valid-res",
          };
          //Act
          const receivedResponse = await request(expressApp)
            .post("/sensor-events")
            .send(validEventToAdd);
          //Assert
          expect(receivedResponse.status).toBe(200);
        });

        // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, it's indeed retrievable from the DB
        // 💡 TIP: Whenever possible, use the public API for verification
        test("when a new valid event is posted, Then it's indeed retrievable from the DB", async () => {
          //Arrange
          const validEventToAdd = {
            temperature: 44,
            name: "Thermostat-temperature-retrievable",
            color: "Green",
            weight: "80 gram",
            status: "active",
            category: "valid-res",
          };
          //Act
          await request(expressApp).post("/sensor-events").send(validEventToAdd);
          //Assert
          const retrievedEvents = await request(expressApp).get(
            "/sensor-events/valid-res/name"
          );
          expect(retrievedEvents.body).toIncludeAllPartialMembers([validEventToAdd]);
        });
        // ✅ Learning TASK: Test that when a new valid event is posted to /sensor-events route, if the temperature exceeds 50 degree a notification is being sent
        // 💡 TIP: This was not covered in the course. To achieve this read about the library 'nock' which can verify that the /localhost/notification service was called
        test("When a new valid event is posted to /sensor-events route, Then if the temperature exceeds 50 degree a notification is being sent", async () => {
          //Arrange
          const eventToAdd = {
            temperature: 51,
            name: "Thermostat-temperature",
            color: "black",
            weight: "40 gram",
            status: "active",
            category: "notification-sent",
          };
          //Act
          await request(expressApp).post("/sensor-events").send(eventToAdd);
          //Assert
          expect(nock.isDone()).toBe(true);
        });
      });

      describe("/GET", () => {
        // ✅ TASK: Test that querying the GET:/sensor-events route, it returns the right event when a single event exist
        // 💡 TIP: Ensure that exactly one was returned and that this is the right event
        // 💡 TIP: Try using as few assertions as possible, maybe even only one
        test("When querying the GET:/sensor-events route, Then returns the right event when a single event exist", async () => {
          //Arrange
          const singleEventToAdd = {
            temperature: 30,
            name: "Thermostat-temperature-only-one",
            color: "Blue",
            weight: "20 gram",
            status: "active",
            category: "valid-onlyone",
          };
          await request(expressApp).post("/sensor-events").send(singleEventToAdd);
          //Act
          const retrievedSoloEvent = await request(expressApp).get(
            "/sensor-events/valid-onlyone/name"
          );
          //Assert
          expect(retrievedSoloEvent.body).toBeArrayOfSize(1);
          expect(retrievedSoloEvent.body).toIncludeAllPartialMembers([
            singleEventToAdd,
          ]);
        });

        // ✅ TASK: Test that querying the GET:/sensor-events route, it returns the right events when multiple events exist
        // 💡 TIP: Ensure that all the relevant events were returned
        test("When querying the GET:/sensor-events route, Then returns the right events when multiple events exist", async () => {
          //Arrange
          const firstEventToAdd = {
            temperature: 10,
            name: "Thermostat-temperature-first-event",
            color: "red",
            weight: "33 gram",
            status: "active",
            category: "multi-events",
          };
          const secondEventToAdd = {
            temperature: 11,
            name: "Thermostat-temperature-second-event",
            color: "red",
            weight: "44 gram",
            status: "active",
            category: "multi-events",
          };
          await request(expressApp)
            .post("/sensor-events")
            .send(firstEventToAdd);
          await request(expressApp)
            .post("/sensor-events")
            .send(secondEventToAdd);
          //Act
          const retrievedMultiEvents = await request(expressApp).get(
            "/sensor-events/multi-events/name"
          );
          //Assert
          expect(retrievedMultiEvents.body).toIncludeAllPartialMembers([
            firstEventToAdd,
            secondEventToAdd,
          ]);
        });
        // ✅ TASK: Test that querying for /sensor-events route and sorting by the field 'name', the results are indeed sorted
        // 💡 TIP: Each test should be independent and might run alone without others, don't count on data (events) from other tests
        test("When querying the GET:/sensor-events route with sort by field 'name', Then the results are indeed sorted", async () => {
          //Arrange
          const firstEventToAdd = {
            temperature: 10,
            name: "ZZZ last sorted",
            color: "red",
            weight: "33 gram",
            status: "active",
            category: "sort-by-name",
          };
          const secondEventToAdd = {
            temperature: 11,
            name: "AAA first sorted",
            color: "red",
            weight: "44 gram",
            status: "active",
            category: "sort-by-name",
          };
          await request(expressApp)
            .post("/sensor-events")
            .send(firstEventToAdd);
          await request(expressApp)
            .post("/sensor-events")
            .send(secondEventToAdd);
          //Act
          const retrievedSortedEvents = await request(expressApp).get(
            "/sensor-events/sort-by-name/name"
          );
          //Assert
          expect(retrievedSortedEvents.body[0]).toMatchObject(secondEventToAdd);
          expect(retrievedSortedEvents.body[1]).toMatchObject(firstEventToAdd);
        });
        
      });
    });
  });



  // ✅ Spread your tests across multiple files, let the test runner invoke tests in multiple processes - Ensure all pass
  // 💡 TIP: You might face port collision where two APIs instances try to open the same port
  // 💡 TIP: Use the flag 'jest --maxWorkers=<num>'. Assign zero for max value of some specific number greater than 1

  // ✅ Ensure that the app is read for production and can stat listening to requests not only during testing
  // 💡 TIP: Sometimes we focus only on testing and it might happen that the app can't bootstrap and listen in a production scenario
});

const request = require("supertest");

const { initializeAPI } = require("../../sensors-api");
const nock = require("nock");

let expressApp, serverConnection;

beforeAll(async (done) => {
    expressApp = initializeAPI();
    serverConnection = expressApp.listen(() => {
        done();
    })
});

afterAll((done) => {
    serverConnection.close(() => {
        done();
    })
})

beforeEach(() => {
    nock("http://localhost").get("/notification").reply(200, {
        success: true,
    });
});

afterEach(() => {
    nock.cleanAll()
})

describe("Sensors test 2", () => {
    // ✅ TASK: Test that when a new event is posted to /event route, if category or temperature are not specified -> the API returns HTTP 400
    test("When category is not specified, should get http 400 error", async () => {
        //Arrange
        const eventToAdd = {
        temperature: 20,
        name: "Thermostat-temperature", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
        };

        //Act
        const receivedResponse = await request(expressApp).post("/sensor-events").send(eventToAdd);

        //Assert
        expect(receivedResponse.status).toBe(400);
    });

    // ✅ TASK: Test that when a new event is posted to /sensor-events route, if category or temperature are not specified -> the event is NOT saved to the DB!
    test("When category or temperature are not specified, should not save event to DB", async () => {
        //Arrange
        const eventWithoutCategory = {
            temperature: 20,
            name: "No-category",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };

        const eventWithoutTemperature = {
            category: 'kids-room',
            name: "No-temperature",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };
    
        //Act
        const noCategoryResponse = await request(expressApp).post("/sensor-events").send(eventWithoutCategory);
        const noTemperatureResponse = await request(expressApp).post("/sensor-events").send(eventWithoutTemperature);

        const getEventsResponse = await request(expressApp).get("/sensor-events/kids-room/name").send();
        const getEventsWithoutNameResponse = await request(expressApp).get("/sensor-events//name").send();

        //Assert
        expect(noCategoryResponse.status).toBe(400);
        expect(noTemperatureResponse.status).toBe(400);

        expect(getEventsResponse.body).toEqual([]);
        expect(getEventsWithoutNameResponse.body).toEqual({}); // What's the right way to test against DB when there's no category if it's a requirement for getting a response?
    });

    // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, we get back a valid response
    test("When a valid event is posted, should return a valid response status and body", async () => {
        //Arrange
        const eventToAdd = {
            temperature: 20,
            category: 'kids-room',
            name: "Valid-event",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };
  
        //Act
        const receivedResponse = await request(expressApp).post("/sensor-events").send(eventToAdd);

        //Assert
        expect(receivedResponse).toMatchObject({
            status: 200,
            body: {...eventToAdd}
        });
    })
});

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

describe("Sensors test", () => {
    // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, it's indeed retrievable from the DB
    test("When a valid event is posted, event should be retrievable from DB", async () => {
        //Arrange
        const eventToAdd = {
            temperature: 20,
            category: 'living-room',
            name: "Retrievable-event",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };

        //Act
        const receivedResponse = await request(expressApp).post("/sensor-events").send(eventToAdd);
        const getEventsResponse = await request(expressApp).get("/sensor-events/living-room/name").send(); 

        //Assert
        expect(getEventsResponse.body[0]).toEqual(receivedResponse.body);
    });

  // ✅ TASK: Test that querying for /sensor-events route works when there is one single event
    test("When querying for /sensor-events when there is only one event, route should work", async () => {
        //Arrange
        const eventToAdd = {
            temperature: 20,
            category: 'parents-room',
            name: "Event-querying",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };

        //Act
        await request(expressApp).post("/sensor-events").send(eventToAdd);
        const getEventsResponse = await request(expressApp).get("/sensor-events/parents-room/name").send(); 

        //Assert
        expect(getEventsResponse.body[0]).toMatchObject({...eventToAdd});
        expect(getEventsResponse.body).toHaveLength(1);
    });
    // Mhhmmm, i feel like i'm either missing something here or more likely, i didn't get the excercise properly

    // ✅ TASK: Test that querying for /sensor-events route works when there are multiple events
    test("When querying for /sensor-events when there are multiple events, route should work", async () => {
        //Arrange
        const eventToAdd = {
            temperature: 20,
            category: 'storage-room',
            name: "Event-querying-1",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };

        const eventToAddTwo = {
            temperature: 20,
            category: 'storage-room',
            name: "Event-querying-2",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };

        const eventToAddThree = {
            temperature: 20,
            category: 'storage-room',
            name: "Event-querying-3",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };

        //Act
        const returnedEvent = await request(expressApp).post("/sensor-events").send(eventToAdd);
        const returnedEventTwo = await request(expressApp).post("/sensor-events").send(eventToAddTwo);
        const returnedEventThree = await request(expressApp).post("/sensor-events").send(eventToAddThree);
        const getEventsResponse = await request(expressApp).get("/sensor-events/storage-room/name").send(); 
        
        //Assert
        expect(getEventsResponse.body).toEqual([
            returnedEvent.body,
            returnedEventTwo.body,
            returnedEventThree.body,
        ])
        expect(getEventsResponse.body).toHaveLength(3);
    });

    // ✅ TASK: Test that querying for /sensor-events route and sorting by the field 'name', the results are indeed sorted
    test("When querying for /sensor-events and sorting by 'name' key, should return a sorted array according to the event's name", async () => {
        //Arrange
        const eventToAdd = {
            temperature: 20,
            category: 'play-room',
            name: "B",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };

        const eventToAddTwo = {
            temperature: 20,
            category: 'play-room',
            name: "C",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };

        const eventToAddThree = {
            temperature: 20,
            category: 'play-room',
            name: "A",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };

        //Act
        const returnedEvent = await request(expressApp).post("/sensor-events").send(eventToAdd);
        const returnedEventTwo = await request(expressApp).post("/sensor-events").send(eventToAddTwo);
        const returnedEventThree = await request(expressApp).post("/sensor-events").send(eventToAddThree);
        const getEventsResponse = await request(expressApp).get("/sensor-events/play-room/name").send(); 
        
        //Assert
        expect(getEventsResponse.body).toEqual([
            returnedEventThree.body,
            returnedEvent.body,
            returnedEventTwo.body,
        ])
    });

    // ✅ Learning TASK: Test that when a new valid event is posted to /sensor-events route, if the temperature exceeds 50 degree a notification is being sent
    test("When querying for /sensor-events when there are multiple events, route should work", async () => {
        //Arrange
        const eventToAdd = {
            temperature: 80,
            category: 'other-room',
            name: "Nock-event",
            color: "Green",
            weight: "80 gram",
            status: "active",
        };

        //Act
        await request(expressApp).post("/sensor-events").send(eventToAdd);
                
        //Assert
        expect(nock.isDone()).toBe(true);
    }); // This is a tricky one, i'm curious whether i got it right or i'm completely off

    // ✅ Ensure that the webserver is closed when all the tests are completed

    // ✅ Spread your tests across multiple files, let the test runner invoke tests in multiple processes - Ensure all pass

});

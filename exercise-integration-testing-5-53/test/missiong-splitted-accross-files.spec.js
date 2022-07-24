
const { initializeAPI, closeApi} = require("../sensors-api");
const nock = require("nock");
const supertest = require("supertest");

let expressApp;

beforeAll(async () => {
    expressApp = await initializeAPI();
});


beforeEach(() => {
    // 📗 Reading exercise: Why is this needed 👇? Read about npm/nock
    nock("http://localhost").get("/notification").reply(200, {
        success: true,
    });
});

// ✅ Ensure that the webserver is closed when all the tests are completed
// 💡 TIP: Use the right test hook to call the API and instruct it to close
afterAll(async ()=>{
     await closeApi();
})

// ✅ Spread your tests across multiple files, let the test runner invoke tests in multiple processes - Ensure all pass
// 💡 TIP: You might face port collision where two APIs instances try to open the same port
// 💡 TIP: Use the flag 'jest --maxWorkers=<num>'. Assign zero for max value of some specific number greater than 1
describe("/api",()=>{
    describe("/sensor-events",()=>{
        describe("/get",()=>{
            // ✅ TASK: Test that querying the GET:/sensor-events route, it returns the right event when a single event exist
            // 💡 TIP: Ensure that exactly one was returned and that this is the right event
            // 💡 TIP: Try using as few assertions as possible, maybe even only one
            it("querying the GET:/sensor-events route, it returns the right event when a single event exist",async ()=>{
                const eventToAdd = {
                    temperature: 50,
                    name: "insert-to-db-test",
                    color: "Green",
                    weight: "80 gram",
                    status: "active",
                    category: "insert-to-db"
                };

                //Act
                await supertest(expressApp).post("/sensor-events").send(eventToAdd);
                const getEventResponse = await supertest(expressApp).get(`/sensor-events/${eventToAdd.category}/name`);

                //Assert
                const relevantEvent=getEventResponse.body.find(val=>val.name===eventToAdd.name)
                expect(relevantEvent).toMatchObject(eventToAdd)
            })
            // ✅ TASK: Test that querying the GET:/sensor-events route, it returns the right events when multiple events exist
            // 💡 TIP: Ensure that all the relevant events were returned
            it("querying the GET:/sensor-events route, it returns the right events when multiple events exist",async ()=>{
                //Arrange
                const event1ToAdd = {
                    temperature: 50,
                    name: "insert-to-db-test1",
                    color: "Green",
                    weight: "80 gram",
                    status: "active",
                    category: "right-event"
                };
                const event2ToAdd = {
                    temperature: 50,
                    name: "insert-to-db-test2",
                    color: "Green",
                    weight: "80 gram",
                    status: "active",
                    category: "right-event"
                };
                const event3ToAdd = {
                    temperature: 50,
                    name: "insert-to-db-test",
                    color: "Green",
                    weight: "80 gram",
                    status: "active",
                    category: "distraction"
                };
                //Act
                await supertest(expressApp).post("/sensor-events").send(event1ToAdd);
                await supertest(expressApp).post("/sensor-events").send(event2ToAdd);
                const getEventResponse = await supertest(expressApp).get(`/sensor-events/${event1ToAdd.category}/name`);

                //Assert
                expect(getEventResponse.body).toMatchObject([event1ToAdd,event2ToAdd])
            })
            // ✅ TASK: Test that querying for /sensor-events route and sorting by the field 'name', the results are indeed sorted
            // 💡 TIP: Each test should be independent and might run alone without others, don't count on data (events) from other tests
            it("querying for /sensor-events route and sorting by the field 'name', the results are indeed sorted",async ()=>{
                //Arrange
                const event1ToAdd = {
                    temperature: 50,
                    name: "second-sorted",
                    color: "Green",
                    weight: "80 gram",
                    status: "active",
                    category: "check-sort"
                };
                const event2ToAdd = {
                    temperature: 50,
                    name: "first-sorted",
                    color: "Green",
                    weight: "80 gram",
                    status: "active",
                    category: "check-sort"
                };
                //Act
                await supertest(expressApp).post("/sensor-events").send(event1ToAdd);
                await supertest(expressApp).post("/sensor-events").send(event2ToAdd);
                const getEventResponse = await supertest(expressApp).get(`/sensor-events/${event1ToAdd.category}/name`);
                //Assert
                expect(getEventResponse.body).toMatchObject([event2ToAdd,event1ToAdd])
            })
        })
    })


})




// ✅ Ensure that the app is read for production and can stat listening to requests not only during testing
// 💡 TIP: Sometimes we focus only on testing and it might happen that the app can't bootstrap and listen in a production scenario

// no idea what this means
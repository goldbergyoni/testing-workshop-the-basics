// 🏅 Your mission is to create your first integration tests here 💜
// ✅ Whenever you see this icon, there's a TASK for you
// 💡 - This is an ADVICE symbol, it will appear nearby most tasks and help you in fulfilling the tasks


const { initializeAPI, closeApi} = require("../sensors-api");
const nock = require("nock");
const supertest = require("supertest");

let expressApp;

beforeAll(async () => {
  expressApp = await initializeAPI();
});


let mockedNotifications;

beforeEach(() => {
  // 📗 Reading exercise: Why is this needed 👇? Read about npm/nock
  mockedNotifications=nock("http://localhost").get("/notification").reply(200, {
    success: true,
  });
});

afterEach(()=>{
  nock.cleanAll();
})

// ✅ Ensure that the webserver is closed when all the tests are completed
// 💡 TIP: Use the right test hook to call the API and instruct it to close
afterAll(async ()=>{
  await closeApi();
})

describe('/api',()=>{
  describe("/sensor-events", () => {
    // ✅ TASK: Test that when a new event is posted to /event route, if category or temperature are not specified -> the API returns HTTP 400
    // 💡 TIP: Down below, there is an example event schema
    describe("/post",()=> {
      test("When category is not specified, should get http 400 error", async () => {
        //Arrange
        const eventToAdd = {
          temperature: 20,
          name: "Thermostat-temperature", //This must be unique
          color: "Green",
          weight: "80 gram",
          status: "active",
          category:undefined
          // 💡 TIP: Consider explicitly specify that category is undefined
        };

        //Act
        // 💡 TIP: use any http client lib like Axios OR supertest
        const receivedResponse = await supertest(expressApp).post("/sensor-events").send(eventToAdd);
        // 💡 TIP: This is how it is done with Supertest -> await request(expressApp).post("/sensor-events").send(eventToAdd);


        //Assert
        // 💡 TIP: verify that status is 400
        expect(receivedResponse.status).toBe(400)
      });
      // ✅ TASK: Test that when a new event is posted to /sensor-events route, the temperature is not specified -> the event is NOT saved to the DB!
      // 💡 TIP: Testing the response is not enough, the adequate state (e.g. DB) should also satisfy the expectation
      it("when temp is no defined the event is not save to db", async () => {
        //Arrange
        const eventToAdd = {
          temperature: undefined,
          name: "no-temp-test",
          color: "Green",
          weight: "80 gram",
          status: "active",
          category: "sensor"
        };
        await supertest(expressApp).post("/sensor-events").send(eventToAdd);

        //Act
        const pullFromDb = await supertest(expressApp).get(`/sensor-events/${eventToAdd.category}/name`);


        //Assert
        expect(pullFromDb.body).toMatchObject([])
      })
      // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, we get back a valid response
      // 💡 TIP: Consider both the HTTP status and the body
      it("when a new valid event is posted to /sensor-events route, we get back a valid response", async () => {
        //Arrange
        const eventToAdd = {
          temperature: 50,
          name: "no-temp-test",
          color: "Green",
          weight: "80 gram",
          status: "active",
          category: "sensor"
        };

        //Act
        const receivedResponse = await supertest(expressApp).post("/sensor-events").send(eventToAdd);

        //Assert
        expect(receivedResponse).toMatchObject({
          "status": 200,
          body: eventToAdd
        })
      })
      // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, it's indeed retrievable from the DB
      // 💡 TIP: Whenever possible, use the public API for verification
      it("when a new valid event is posted to /sensor-events route, it's indeed retrievable from the DB", async () => {
        //Arrange
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
        expect(getEventResponse.body.length).toBe(1)
      })
      // ✅ Learning TASK: Test that when a new valid event is posted to /sensor-events route, if the temperature exceeds 50 degree a notification is being sent
      // 💡 TIP: This was not covered in the course. To achieve this read about the library 'nock' which can verify that the /localhost/notification service was called
      it("when a new valid event is posted to /sensor-events route, if the temperature exceeds 50 degree a notification is being sent",async ()=>{
        //Arrange
        const eventToAdd = {
          temperature: 60,
          name: "second-sorted",
          color: "Green",
          weight: "80 gram",
          status: "active",
          category: "check-sort"
        };
        //Act
        await supertest(expressApp).post("/sensor-events").send(eventToAdd);

        //Assert
        mockedNotifications.done()
      })
    });

  });

})


// const request = require("supertest");
const axios = require("axios");
const { initializeAPI } = require("../../sensors-api");
const nock = require("nock");

let App;
let port;
let server;

beforeAll(async () => {
  const { expressApp, thePort, theServer } = await initializeAPI();
  App = expressApp;
  port = thePort;
  server = theServer;
});

afterAll((done) => {
  server.close(() => {
    done();
  });
});

beforeEach(() => {
    nock("http://localhost").get("/notification").reply(200, {
      success: true,
    });
  });
  
  function helper(length) {
    var randomChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }
  describe("Sensors test", () => {
    // ✅ TASK: Test that when a new event is posted to /event route, if category or temperature are not specified -> the API returns HTTP 400
    // 💡 TIP: Down below, there is an example event schema
    
  
    // ✅ TASK: Test that when a new event is posted to /sensor-events route, the temperature is not specified -> the event is NOT saved to the DB!
    // 💡 TIP: Testing the response is not enough, the adequate state (e.g. DB) should also satisfy the expectation
  
    
  
    // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, we get back a valid response
    // 💡 TIP: Consider both the HTTP status and the body
  
    test("When new valid event is send,  should get back ", async () => {
      //Arrange
      const eventToAdd = {
        category: "kids-room",
        temperature: 20,
        name: "Thermostat-temperature", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };
      //Act
  
      const config = {
        validateStatus: () => true,
      };
      const url = `http://localhost:${port}/sensor-events`;
      const res = await axios.post(url, eventToAdd, config);
  
      //Assert
      expect(res.status).toBe(200);
    });
  
    // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, it's indeed retrievable from the DB
    // 💡 TIP: Whenever possible, use the public API for verification
  
    test("When new valid event is send,  should retrievable the data from the DB (2 objects)", async () => {
      //Arrange
      const eventToAdd = {
        category: "kids-room",
        temperature: 20,
        name: "Thermostat-temperature-new", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };
      //Act
  
      const config = {
        validateStatus: () => true,
      };
      const urlFetchSensorEvent = `http://localhost:${port}/sensor-events`;
      const urlGetEventByCategory = `http://localhost:${port}/sensor-events/${eventToAdd.category}/${eventToAdd.name}`;
  
      await axios.post(urlFetchSensorEvent, eventToAdd, config);
      const eventFromDb = await axios.get(urlGetEventByCategory);
      // console.log("retrive data ", eventFromDb);
      //Assert
      expect(eventFromDb.status).toBe(200);
      expect(eventFromDb.data.length).toBe(2); // One obj from the last test and one is from the current test.
    });
  
    // ✅ TASK: Test that querying the GET:/sensor-events route, it returns the right event when a single event exist
    // 💡 TIP: Ensure that exactly one was returned and that this is the right event
    // 💡 TIP: Try using as few assertions as possible, maybe even only one
  
    test("When new valid event is send, it return the right event when a single event exist", async () => {
      //Arrange
  
      //Act
  
      const eventToAdd = {
        category: `${helper(5)}`,
        temperature: 20,
        name: "Thermostat-temperature-new", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };
  
      console.log(eventToAdd);
      const config = {
        validateStatus: () => true,
      };
      const urlFetchSensorEvent = `http://localhost:${port}/sensor-events`;
      const urlGetEventByCategory = `http://localhost:${port}/sensor-events/${eventToAdd.category}/${eventToAdd.name}`;
  
      await axios.post(urlFetchSensorEvent, eventToAdd, config);
      const eventFromDb = await axios.get(urlGetEventByCategory);
      console.log("retrive data ", eventFromDb.data.length);
      //Assert
      expect(eventFromDb.status).toBe(200);
      expect(eventFromDb.data.length).toBe(1); // One obj from the last test and one is from the current test.
    });
  
    // ✅ TASK: Test that querying the GET:/sensor-events route, it returns the right events when multiple events exist
    // 💡 TIP: Ensure that all the relevant events were returned
  
    test("When new valid event is send, should retrievable the data from the DB when muliple events exist", async () => {
      //Arrange
  
      const category = helper(5);
  
      const firstEventToAdd = {
        category: `${category}`,
        temperature: 20,
        name: "Thermostat-temperature", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };
  
      const secondEventToAdd = {
        category: `${category}`,
        temperature: 25,
        name: "Thermostat-temperature-new-one", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };
  
      //Act
  
      const config = {
        validateStatus: () => true,
      };
      const urlFetchSensorEvent = `http://localhost:${port}/sensor-events`;
      const urlGetEventByCategory = `http://localhost:${port}/sensor-events/${firstEventToAdd.category}/${firstEventToAdd.name}`;
  
      await axios.post(urlFetchSensorEvent, firstEventToAdd, config);
      await axios.post(urlFetchSensorEvent, secondEventToAdd, config);
  
      const eventFromDb = await axios.get(urlGetEventByCategory);
      //Assert
      expect(eventFromDb.status).toBe(200);
      expect(eventFromDb.data.length).toBe(2);
    });
  
    // ✅ TASK: Test that querying for /sensor-events route and sorting by the field 'name', the results are indeed sorted
    // 💡 TIP: Each test should be independent and might run alone without others, don't count on data (events) from other tests
  
    test("When new 3 valid events is send, should return the events while them sort by name", async () => {
      //Arrange
      const category = helper(5);
  
      const firstEventToAdd = {
        category: `${category}`,
        temperature: 20,
        name: "aaa", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };
  
      const secondEventToAdd = {
        category: `${category}`,
        temperature: 25,
        name: "bbb", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };
  
      const thirdEventToAdd = {
        category: `${category}`,
        temperature: 25,
        name: "ccc", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };
  
      //Act
  
      const config = {
        validateStatus: () => true,
      };
      const urlFetchSensorEvent = `http://localhost:${port}/sensor-events`;
      const urlGetEventByCategory = `http://localhost:${port}/sensor-events/${firstEventToAdd.category}/${firstEventToAdd.name}`;
  
      await axios.post(urlFetchSensorEvent, thirdEventToAdd, config); //ccc
      await axios.post(urlFetchSensorEvent, firstEventToAdd, config); //aaa
      await axios.post(urlFetchSensorEvent, secondEventToAdd, config); //bbb
  
      const eventFromDb = await axios.get(urlGetEventByCategory);
      //Assert
      console.log("the return events: ", eventFromDb.data);
      expect(eventFromDb.status).toBe(200);
      expect(eventFromDb.data.length).toBe(3);
      expect(eventFromDb.data[0].name).toBe("aaa");
      expect(eventFromDb.data[1].name).not.toBe("ccc"); // bbb
      expect(eventFromDb.data[2].name).toBe("ccc");
    });
  
    // ✅ Learning TASK: Test that when a new valid event is posted to /sensor-events route, if the temperature exceeds 50 degree a notification is being sent
    // 💡 TIP: This was not covered in the course. To achieve this read about the library 'nock' which can verify that the /localhost/notification service was called
  
    test("When new valid event is send with 60 deg temperature, so it should call the nock function witch action the nock and will return the notification", async () => {
      //Arrange
  
      //Act
  
      const eventToAdd = {
        category: "kids-room",
        temperature: 60,
        name: "Thermostat-temperature", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };
  
      console.log(eventToAdd);
      const config = {
        validateStatus: () => true,
      };
      const urlFetchSensorEvent = `http://localhost:${port}/sensor-events`;
  
      const notification = await axios.post(
        urlFetchSensorEvent,
        eventToAdd,
        config
      );
      //Assert
      expect(notification.status).toBe(200);
      expect(notification.data.success).toBe(true);
    });
  
  });
  
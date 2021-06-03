// const request = require("supertest");
const axios = require("axios");
const { initializeAPI } = require("../../sensors-api");
const nock = require("nock");
const { axiosStatusCodeConfig, generateEventForTesting }  = require("../test-helper");

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
   
  });
  
  function generateUniqueCategoryOnSize(length) {
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
  //helper function can be replace to: Math.random()*1000


  describe("Sensors test", () => {
    // ✅ TASK: Test that when a new event is posted to /event route, if category or temperature are not specified -> the API returns HTTP 400
    // 💡 TIP: Down below, there is an example event schema
    
  
    // ✅ TASK: Test that when a new event is posted to /sensor-events route, the temperature is not specified -> the event is NOT saved to the DB!
    // 💡 TIP: Testing the response is not enough, the adequate state (e.g. DB) should also satisfy the expectation
  
    
  
    // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, we get back a valid response
    // 💡 TIP: Consider both the HTTP status and the body
  
    test("When new valid event is send,  should get back a valid response", async () => {
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
  
      const url = `http://localhost:${port}/sensor-events`;
      const res = await axios.post(url, eventToAdd, axiosStatusCodeConfig());
  
      //Assert
      expect(res.status).toBe(200);
      expect(res.data).not.toEqual([]) // check the body (if the data array )
      expect(res).toMatchObject({status: 200})
    });
  
    // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, it's indeed retrievable from the DB
    // 💡 TIP: Whenever possible, use the public API for verification
  
    test("When new valid event is send,  should retrievable the data from the DB ", async () => {
      //Arrange
      const eventToAdd = {
        category: "bath-room",
        temperature: 20,
        name: "Thermostat-temperature-new", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };

      const urlFetchSensorEvent = `http://localhost:${port}/sensor-events`;
      const urlGetEventByCategory = `http://localhost:${port}/sensor-events/${eventToAdd.category}/${eventToAdd.name}`;
  
      //Act
  

      
      await axios.post(urlFetchSensorEvent, eventToAdd, axiosStatusCodeConfig());
      const eventFromDb = await axios.get(urlGetEventByCategory);
      // console.log("retrive data ", eventFromDb);
      //Assert
      expect(eventFromDb.status).toBe(200);
      expect(eventFromDb.data.length).toBe(1); // One obj from the last test and one is from the current test.
    });
  
    // ✅ TASK: Test that querying the GET:/sensor-events route, it returns the right event when a single event exist
    // 💡 TIP: Ensure that exactly one was returned and that this is the right event
    // 💡 TIP: Try using as few assertions as possible, maybe even only one
  
    test("When new valid event is send, it return the right event when a single event exist", async () => {
      //Arrange
  
      //Act
  
      const eventToAdd = {
        category: `${generateUniqueCategoryOnSize(5)}`,
        temperature: 20,
        name: "Thermostat-temperature-new", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };
  
      const urlFetchSensorEvent = `http://localhost:${port}/sensor-events`;
      const urlGetEventByCategory = `http://localhost:${port}/sensor-events/${eventToAdd.category}/${eventToAdd.name}`;
  
      await axios.post(urlFetchSensorEvent, eventToAdd, axiosStatusCodeConfig());
      const eventFromDb = await axios.get(urlGetEventByCategory);
      console.log("retrive data ", eventFromDb.data[0].category);
      
      //Assert
      expect(eventFromDb.status).toBe(200);
      expect(eventFromDb.data[0].category).toEqual(eventToAdd.category); //the only event that match is the event with the unique category.
    });
  
    // ✅ TASK: Test that querying the GET:/sensor-events route, it returns the right events when multiple events exist
    // 💡 TIP: Ensure that all the relevant events were returned
  
    test("When new valid event is send, should retrievable the data from the DB when muliple events exist", async () => {
      //Arrange
  
      const category = generateUniqueCategoryOnSize(5);
      const events = generateEventForTesting(2,category);
      const urlGetEventByCategory = `http://localhost:${port}/sensor-events/${events[0].category}/name`;

      //Act
    
      await events.map((event) => {
         axios.post(`http://localhost:${port}/sensor-events`, event, axiosStatusCodeConfig())
      })
      const eventFromDb = await axios.get(urlGetEventByCategory);

      //Assert
      expect(eventFromDb.status).toBe(200);
      expect(eventFromDb.data.length).toBe(2);
    });
  
    // ✅ TASK: Test that querying for /sensor-events route and sorting by the field 'name', the results are indeed sorted
    // 💡 TIP: Each test should be independent and might run alone without others, don't count on data (events) from other tests
  
    test("When new 3 valid events is send, should return the events while them sort by name", async () => {
      //Arrange
      const category = generateUniqueCategoryOnSize(5);
      const events = generateEventForTesting(3,category);

      //Act

      await events.map((event) => {
         axios.post(`http://localhost:${port}/sensor-events`, event, axiosStatusCodeConfig())
      })
  
      const eventsFromDb = await axios.get(`http://localhost:${port}/sensor-events/${events[0].category}/name`);
      //Assert
      console.log("the return events: ", eventsFromDb.data);
      expect(eventsFromDb.status).toBe(200);
      expect(parseInt(eventsFromDb.data[0].name)).toBeLessThan(parseInt(eventsFromDb.data[1].name));
      expect(parseInt(eventsFromDb.data[1].name)).toBeLessThan(parseInt(eventsFromDb.data[2].name));
    });
  
    // ✅ Learning TASK: Test that when a new valid event is posted to /sensor-events route, if the temperature exceeds 50 degree a notification is being sent
    // 💡 TIP: This was not covered in the course. To achieve this read about the library 'nock' which can verify that the /localhost/notification service was called
  
    test("When new valid event is send with 60 deg temperature, so it should call the nock function witch action the nock and will return the notification", async () => {
      //Arrange
  
  
      const eventToAdd = {
        category: "kids-room",
        temperature: 60,
        name: "Thermostat-temperature", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };

      const urlFetchSensorEvent = `http://localhost:${port}/sensor-events`;
      //Act

      const nocked = nock("http://localhost").get("/notification").reply(200, {
        success: true,
      });

      const notification = await axios.post(
        urlFetchSensorEvent,
        eventToAdd,
        axiosStatusCodeConfig()
      );

      //Assert
      expect(notification.status).toBe(200);
      expect(notification.data.success).toBe(true);
      expect(nocked.isDone()).toBe(true);
    });
  
  });
  
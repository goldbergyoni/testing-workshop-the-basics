// const request = require("supertest");
const axios = require("axios");
const { initializeAPI } = require("../../sensors-api");
const nock = require("nock");
const {axiosStatusCodeConfig} = require("../test-helper");

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
  

  describe("Sensors test", () => {
    // ✅ TASK: Test that when a new event is posted to /event route, if category or temperature are not specified -> the API returns HTTP 400
    // 💡 TIP: Down below, there is an example event schema
    test("When category is not specified, should get http 400 error", async () => {
      //Arrange
      const eventToAdd = {
        temperature: 20,
        name: "Thermostat-temperature", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
        // 💡 TIP: Consider explicitly specify that category is undefined
      };
      //Act
  
      //The config is for response of status code ! 200-299

      const url = `http://localhost:${port}/sensor-events`;
      const res = await axios.post(url, eventToAdd, axiosStatusCodeConfig());
      // const response = await request(expressApp).post('/sensor-events').send(eventToAdd)
  
      // 💡 TIP: use any http client lib like Axios OR supertest
      // 💡 TIP: This is how it is done with Supertest -> await request(expressApp).post("/sensor-events").send(eventToAdd);
      //Assert
      expect(res.status).toBe(400);
  
      // 💡 TIP: verify that status is 400
    });
  
    // ✅ TASK: Test that when a new event is posted to /sensor-events route, the temperature is not specified -> the event is NOT saved to the DB!
    // 💡 TIP: Testing the response is not enough, the adequate state (e.g. DB) should also satisfy the expectation
  
    test("When temperature is not specified, should get http 400 error", async () => {
      //Arrange
      const eventToAdd = {
        category: `kids-room-${Math.random()*1000}`,
        name: "Thermostat-temperature", //This must be unique
        color: "Green",
        weight: "80 gram",
        status: "active",
      };

      const url = `http://localhost:${port}/sensor-events`;
      const urlGetEventByCategory = `http://localhost:${port}/sensor-events/${eventToAdd.category}/${eventToAdd.name}`;

      //Act
  
      const res = await axios.post(url, eventToAdd, axiosStatusCodeConfig());
      const isInserted = await axios.get(urlGetEventByCategory);
      //Assert
      expect(res.status).toBe(400);
      expect(isInserted.data).toEqual([]);
    });
  
    // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, we get back a valid response
    // 💡 TIP: Consider both the HTTP status and the body
  
  });
  
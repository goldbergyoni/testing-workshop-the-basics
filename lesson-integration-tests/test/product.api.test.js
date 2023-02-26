const axios = require("axios");
const supertest = require("supertest");
const {
  initializeServer,
  stopServer
} = require("../products-api");
let expressApp;
beforeAll(async () => {
  expressApp = await initializeServer();
});

afterAll(async () => {
  await stopServer();
});


describe("/api", () => {
  describe("/product", () => {
    describe("POST", () => {
      test("When a valid product is added, then get a successful response", async () => {
        /// Arrange
        const productToAdd = {
          name: "Dracula",
          price: 100,
          category: "books",
        };

        // Act
        const receivedResponse = await supertest(expressApp).post("/product").send(productToAdd);

        // Assert
        expect(receivedResponse).toMatchObject({
          status: 200,
          body: {
            status: "succeeded",
          },
        });
      });





      test('When no name is specified, then get back error 400', async () => {
        /// Arrange
        const productToAdd = {
          price: 100,
          category: "books",
        };

        // Act
        const receivedResponse = await supertest(expressApp).post("/product").send(productToAdd);

        // Assert
        expect(receivedResponse.status).toBe(400);
      });
    });
  });
});
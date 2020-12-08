const axios = require("axios");
const supertest = require("supertest");
const { initializeServer, stopServer } = require("../api/products-api");
let expressApp;
beforeAll(async (done) => {
  expressApp = await initializeServer();
  done();
});

afterAll(async (done) => {
  await stopServer();
  done();
});

describe("Integration tests", () => {
  test("When a valid product is added, then get a successful response", async () => {
    /// Arrange
    const productToAdd = {
      name: "Dracula",
      category: "books",
      vendorName: "Green-Books",
      vendorProductId: "1a-bc-23",
    };

    // Act
    const receivedResponse = await supertest(expressApp).post("/product").send(productToAdd);

    // Assert
    expect(receivedResponse).toMatchObject({
      status: 200,
      body: {
        name: "Dracula",
        category: "books",
        price: expect.any(Number),
      },
    });
  });
});
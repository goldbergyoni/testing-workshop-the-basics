const nock = require("nock");
const sinon = require("sinon");
const supertest = require("supertest");
const { initializeServer, stopServer } = require("../../../api/products-api");

let expressApp;
beforeAll(async () => {
  expressApp = await initializeServer();
});

beforeEach(() => {
  nock("http://email-service.com").post("/api").reply(200, { succeeded: true });
  sinon.restore();
});

afterAll(async () => {
  await stopServer();
});

describe("Integration tests", () => {
  for (let index = 0; index < 25; index++) {
    test("When a valid product is added, then get a successful response", async () => {
      // Arrange
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
  }
});

const nock = require("nock");
const sinon = require("sinon");
const supertest = require("supertest");
const { initializeServer, stopServer } = require("../api/products-api");
const config = require("../business-logic/config");
const dataAccess = require("../data-access/data-access");
let expressApp;
beforeAll(async (done) => {
  expressApp = await initializeServer();
  done();
});

beforeEach(() => {
  nock("http://email-service.com").post("/api").reply(200, { succeeded: true });
  sinon.restore();
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

  // ⚠️ Anti-Pattern: This is a false attempt to perform a unit test from 10,000ft level
  test("When highly popular and low return rate, then assign 20% discount to product", async () => {
    /// Arrange
    const productToAdd = {
      name: "Dracula",
      category: "books",
      vendorName: "Green-Books",
      vendorProductId: "1a-bc-23",
    };
    sinon.stub(dataAccess, "getVendorProductDetails").returns({
      popularity: 0.95,
      vendorPrice: 100,
      returnRate: 0.05,
      color: "blue",
      storageSizeInCC: 200,
      productionCountry: "China",
      productCategory: "Books",
    });
    config.desiredProfit = 0;

    // Act
    const receivedResponse = await supertest(expressApp).post("/product").send(productToAdd);

    // Assert
    expect(receivedResponse.body.price).toBe(80);
  });
});

const nock = require("nock");
const sinon = require("sinon");
const supertest = require("supertest");
const { initializeServer, stopServer } = require("../api/products-api");
const config = require("../business-logic/config");
const smsSender = require("../business-logic/sms-sender");
const dataAccess = require("../data-access/data-access");

let expressApp;

beforeAll(async () => {
  expressApp = await initializeServer();
});

beforeEach(() => {
  sinon.restore();
  nock("http://email-service.com").post("/api").reply(200, { succeeded: true });
  sinon.stub(smsSender, "sendSMS").returns(Promise.resolve(true));
});

afterAll(async () => {
  await stopServer();
});

describe("Integration tests", () => {
  test("When highly popular, low return rate and no tax restrictions, then get 20% discount", async () => {
    // Arrange
    const productToAdd = {
      name: "Dracula",
      category: "books",
      vendorName: "Green-Books",
      vendorProductId: "1a-bc-23",
    };
    const highlyPopularRate = 0.99;
    const lowReturnRate = 0.05;
    const countryWithoutTaxRestrictions = "India";
    const basePriceBeforeDiscount = 100;
    sinon.stub(dataAccess, "getVendorProductDetails").returns(
      Promise.resolve({
        popularity: highlyPopularRate,
        vendorPrice: basePriceBeforeDiscount,
        returnRate: lowReturnRate,
        color: "blue",
        storageSizeInCC: 200,
        productionCountry: countryWithoutTaxRestrictions,
        productCategory: "Books",
      })
    );
    config.desiredProfit = 0;

    // Act
    const receivedResponse = await supertest(expressApp).post("/product").send(productToAdd);

    // Assert
    expect(receivedResponse).toMatchObject({
      status: 200,
      body: {
        price: 80,
      },
    });
  });

  test("When adding a valid product, then get back a successful response with the product inside", async () => {
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
});

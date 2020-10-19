const axios = require("axios");
const nock = require("nock");
const sinon = require("sinon");
const ProductsService = require("../products-service");
const SMSSender = require("../sms-sender");
const smsSenderInASingleFunction = require("../sms-sender-in-a-single-function");

beforeAll(() => {
  nock("http://email-service.com")
    .post("/api")
    .reply(200, {
      success: true,
    })
    .persist(true);
});

beforeEach(() => {
  sinon.restore();
  sinon.stub(SMSSender, "sendSMS").returns;
  Promise.resolve({
    succeeded: true,
  });
});

test("When adding a valid new Product, then get a positive response", async () => {
  /// Arrange
  const productServiceUnderTest = new ProductsService();

  // Act
  const receivedResponse = await productServiceUnderTest.addProduct("Peace & War", 180, "Books");

  // Assert
  expect(receivedResponse.succeeded).toBe(true);
});

test("When adding a valid new Product, then SMS is sent", async () => {
  /// Arrange
  const productServiceUnderTest = new ProductsService();
  sinon.restore();
  const spyOnSMS = sinon.stub(SMSSender, "sendSMS").returns(Promise.resolve({
    succeeded: true
  }));

  // Act
  await productServiceUnderTest.addProduct("Peace & War", 180, "Books");

  // Assert
  expect(spyOnSMS.called).toBe(true);
});
const nock = require("nock");
const sinon = require("sinon");
const ProductsService = require("../products-service-di-style");
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
});




describe('Add product', () => {
  describe('Happy path', () => {
    test('When a product is added, then SMS is sent', async () => {
      /// Arrange
      const doubleSMSSender = {
        sendSMS: sinon.spy()
      }
      const productServiceUnderTest = new ProductsService(doubleSMSSender);

      // Act
      await productServiceUnderTest.addProduct("War & Peace", 200, "Books");

      // Assert
      expect(doubleSMSSender.sendSMS.called).toBe(true);
    });
  });
});
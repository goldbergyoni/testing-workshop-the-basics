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
  sinon.stub(SMSSender, "sendSMS").returns;
  Promise.resolve({

    succeeded: true,
  });
});

describe('Add product', () => {
  describe('Happy path', () => {
    test("When adding a valid new Product, then SMS is sent (using spy)", async () => {
      // Arrange
      sinon.restore();
      const doubleSMSProvider = {
        sendSMS: sinon.spy()
      };
      const productService = new ProductsService(doubleSMSProvider);

      // Act
      await productService.addProduct("Peace & War", 180, "Books");

      // Assert
      expect(doubleSMSProvider.sendSMS.called).toBe(true);
    });
  });
});
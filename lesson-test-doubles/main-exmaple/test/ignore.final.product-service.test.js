const axios = require("axios");
const nock = require("nock");
const sinon = require("sinon");
const productDataAccess = require("../product-data-access");
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

describe("Add product", () => {
  describe("Happy path", () => {
    test("When adding a valid product, then an email should be sent", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();
      nock.cleanAll();
      const emailRequestIntercept = nock("http://email-service.com").post("/api").reply(200, {
        success: true,
      });

      // Act
      await productServiceUnderTest.addProduct("Harry Potter", 200, "Books");

      // Assert
      expect(emailRequestIntercept.isDone()).toBe(true);
    });

    test("When adding a valid new Product, then get a positive response", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();

      // Act
      const receivedResponse = await productServiceUnderTest.addProduct("Peace & War", 180, "Books");

      // Assert
      expect(receivedResponse.succeeded).toBe(true);
    });

    test("When adding a valid new Product, then SMS is sent (using spy)", async () => {
      // Arrange
      sinon.restore();
      const doubleSMSProvider = {
        sendSMS: sinon.spy(),
      };
      const productService = new ProductsService(doubleSMSProvider);

      // Act
      await productService.addProduct("Peace & War", 180, "Books");

      // Assert
      expect(doubleSMSProvider.sendSMS.called).toBe(true);
    });

    test("When adding a valid new Product, then SMS is sent (using stub)", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();
      sinon.restore();
      const spyOnSMS = sinon.stub(SMSSender, "sendSMS").returns(
        Promise.resolve({
          succeeded: true,
        })
      );

      // Act
      await productServiceUnderTest.addProduct("Peace & War", 180, "Books");

      // Assert
      expect(spyOnSMS.called).toBe(true);
    });

    test("When adding a valid new Product, then SMS is sent (using spy)", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();
      sinon.restore();
      const spyOnSMS = sinon.spy(SMSSender, "sendSMS");

      // Act
      await productServiceUnderTest.addProduct("Peace & War", 180, "Books");

      // Assert
      expect(spyOnSMS.called).toBe(true);
    });

    test("When a valid product is added, then it's saved in DB (⚠️Anti-Pattern)", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();
      const dataAccessMock = sinon.mock(productDataAccess);
      dataAccessMock
        .expects("saveProduct")
        .exactly(1)
        .withExactArgs(
          {
            name: "Peace & War",
            price: 180,
            category: "Books",
          },
          false
        )
        .returns(Promise.resolve(null));

      // Act
      productServiceUnderTest.addProduct("Peace & War", 180, "Books");

      // Assert
      dataAccessMock.verify();
    });

    test("When a valid product is added, then it's retrievable (✅ Better option)", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();
      const newBookName = "Peace & War";

      // Act
      productServiceUnderTest.addProduct(newBookName, 180, "Books");

      // Assert
      const foundedBook = await productServiceUnderTest.getProductByName(newBookName);
      expect(foundedBook.name).toBe(newBookName);
    });
  });

  describe("Corner cases", () => {
    test("When adding a product on 1st day of a month, an error is thrown back", async () => {
      // Arrange
      const productServiceUnderTest = new ProductsService();
      const firstDayOfMonth = new Date().setDate(1);
      sinon.useFakeTimers(firstDayOfMonth);

      // Act
      const addProductMethod = async () => {
        return await productServiceUnderTest.addProduct("War & Peace", 200, "Books");
      };

      // Assert
      await expect(addProductMethod).rejects.toEqual(new Error("No new products on Month 1st"));
    });

    test("When SMS sending fails, then the response is successful", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();
      sinon.restore();
      sinon.stub(SMSSender, "sendSMS").throws(new Error("No SMS for you"));

      // Act
      const receivedResponse = await productServiceUnderTest.addProduct("Peace & War", 180, "Books");

      // Assert
      expect(receivedResponse.succeeded).toBe(true);
    });
  });
});

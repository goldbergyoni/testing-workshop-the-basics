const nock = require("nock");
const sinon = require("sinon");
const productDataAccess = require("../product-data-access");
const SMSSender = require("../sms-sender");
const sendSMSMethod = sinon.stub(SMSSender, "sendSMS");
const ProductsService = require("../products-service");

beforeAll(async () => {});

afterAll(async () => {});

beforeEach(() => {
  nock("http://email-service.com").post("/api").reply(200, { succeeded: true });
});

afterEach(() => {
  sinon.restore();
});

describe("Add product", () => {
  describe("Happy path", () => {
    test("When adding a valid product, then an email should be sent", async () => {
      // Arrange
      const productService = new ProductsService();
      nock.cleanAll();
      const emailIntercept = nock("http://email-service.com").post("/api").reply(200, {
        success: true,
      });

      // Act
      await productService.addProduct("Harry Potter", 300, "Books");

      // Assert
      expect(emailIntercept.isDone()).toBe(true);
    });

    test("When a product is added, then SMS is sent", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();
      const spyOnSMS = sinon.stub(SMSSender, "sendSMS");

      // Act
      await productServiceUnderTest.addProduct("War & Peace", 200, "Books");

      // Assert
      expect(sendSMSMethod.called).toBe(true);
    });

    test("When a valid product is added, then its retrievable (⚠✅Good pattern)", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();
      const newBookName = "War & Peace";

      // Act
      await productServiceUnderTest.addProduct(newBookName, 180, "Books");

      // Assert
      const foundedBook = await productServiceUnderTest.getProductByName(newBookName);
      expect(foundedBook.name).toBe(newBookName);
    });

    test("When a valid product is added, then its saved to DB (⚠️Anti pattern)", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();
      const dataAccessMock = sinon.mock(productDataAccess);
      dataAccessMock
        .expects("saveProduct")
        .exactly(1)
        .withExactArgs(
          {
            name: "War & Peace",
            price: 180,
            category: "Books",
          },
          false
        )
        .returns(Promise.resolve(null));

      // Act
      await productServiceUnderTest.addProduct("War & Peace", 180, "Books");

      // Assert
      dataAccessMock.verify();
    });
  });

  describe("Corner cases", () => {
    test("When adding invalid product, then no email should be sent", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();
      const productNameWhichIsEmpty = undefined;
      nock.cleanAll();
      const emailRequestIntercept = nock("http://email-service.com").post("/api").reply(200, {
        success: true,
      });

      // Act
      try {
        await productServiceUnderTest.addProduct(productNameWhichIsEmpty, 200, "Books");
      } catch (e) {
        //ignore errors, we care only about the email
      }

      // Assert
      expect(emailRequestIntercept.isDone()).toBe(false);
    });

    test("When SMS sending fails, then response is still valid", async () => {
      /// Arrange
      const productServiceUnderTest = new ProductsService();
      //Simulate SMS failure
      sinon.stub(SMSSender, "sendSMS").callsFake(() => {
        //custom logic comes here
      });

      // Act
      const receivedResult = await productServiceUnderTest.addProduct("War & Peace", 200, "Books");

      // Assert
      expect(receivedResult.succeeded).toBe(true);
    });
  });
});

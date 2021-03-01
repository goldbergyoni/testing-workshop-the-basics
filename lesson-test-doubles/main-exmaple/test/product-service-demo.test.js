const nock = require("nock");
const sinon = require("sinon");
const productDataAccess = require("../product-data-access");
const SMSSender = require("../sms-sender");
//jest.mock("../sms-sender-in-a-single-function");
const smsSenderInASingleFunction = require("../sms-sender-in-a-single-function");
const ProductsService = require("../products-service");

let SMSSenderStub, fakeClock;

beforeAll(async () => {});

afterAll(async () => {});

beforeEach(() => {
  nock("http://email-service.com").post("/api").reply(200, { succeeded: true });
});

afterEach(() => {
  sinon.restore();
});

describe("Add product", () => {
  test("When a product is added, then SMS is sent", async () => {
    /// Arrange
    const productServiceUnderTest = new ProductsService();

    // Act
    await productServiceUnderTest.addProduct("War & Peace", 200, "Books");

    // Assert
  });

  test("When SMS sending fails, then response is still valid", async () => {
    /// Arrange
    const productServiceUnderTest = new ProductsService();

    // Act
    const receivedResult = await productServiceUnderTest.addProduct("War & Peace", 200, "Toys");

    // Assert
  });

  test("When a product is added, then is it saved to DB (⚠️ Anti-pattern)", async () => {
    // Arrange
    const productServiceUnderTest = new ProductsService();
    let dataAccessMock;

    // Act
    await productServiceUnderTest.addProduct("War & Peace", 180, "Books");

    // Assert
  });

  test("When a product is added, then SMS is saved (✅ Better pattern)", async () => {
    // Arrange
    const productServiceUnderTest = new ProductsService();

    // Act
    await productServiceUnderTest.addProduct("War & Peace", 200, "Books");

    // Assert
  });

  test("When adding a product on 1st day of a month, an error is thrown back", async () => {
    // Arrange
    const productServiceUnderTest = new ProductsService();

    // Act
    const addProductMethod = async () => {
      return await productServiceUnderTest.addProduct("War & Peace", 200, "Books");
    };

    // Assert
  });
});

const nock = require("nock");
const sinon = require("sinon");
const productDataAccess = require("../product-data-access");
const SMSSender = require("../sms-sender");
const ProductsService = require("../products-service");
//jest.mock("../sms-sender-in-a-single-function");
const smsSenderInASingleFunction = require("../sms-sender-in-a-single-function");
const { clock } = require("sinon");

let SMSSenderStub, fakeClock;

beforeAll(async () => {});

afterAll(async () => {});

beforeEach(() => {
  nock("http://email-service.com").post("/api").reply(200, { succeeded: true });
  SMSSenderStub = sinon.stub(SMSSender);
  fakeClock = sinon.useFakeTimers(new Date());
});

afterEach(() => {
  fakeClock.restore();
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
    SMSSenderStub.sendSMS.throws(new Error("Out of credit"));
    //sinon.stub(SMSSender, "sendSMS").throws(new Error("Out of credit"));

    // Act
    const receivedResult = await productServiceUnderTest.addProduct("War & Peace", 200, "Toys");

    // Assert
    expect(receivedResult.succeeded).toBe(true);
  });
});

test("When a product is added, then is it saved to DB", async () => {
  // Arrange
  const productServiceUnderTest = new ProductsService();

  // Act
  await productServiceUnderTest.addProduct("War & Peace", 200, "Books");

  // Assert
});

test("When a product is added, then SMS is saved part II", async () => {
  // Arrange
  const productServiceUnderTest = new ProductsService();

  // Act
  await productServiceUnderTest.addProduct("War & Peace", 200, "Books");

  // Assert
});

test("When adding a product on 1st day of a month, an error is thrown back", async () => {
  // Arrange
  const productServiceUnderTest = new ProductsService();
  const firstDayOfMonth = new Date().setDate(2);
  fakeClock.restore();
  sinon.useFakeTimers(firstDayOfMonth);

  // Act
  const addProductMethod = async () => {
    return await productServiceUnderTest.addProduct("War & Peace", 200, "Books");
  };

  // Assert
  await expect(addProductMethod).rejects.toEqual(new Error("No new products on Month 1st"));
});

const nock = require("nock");
const sinon = require("sinon");
const ProductService = require("./products-service");
const dataAccess = require("../data-access/data-access");
const smsSender = require("../../lesson-test-doubles/main-exmaple/sms-sender");
const PriceCalculator = require("./price-calculator");

beforeEach(() => {
  sinon.restore();
  nock("http://email-service.com").post("/api").reply(200, { succeeded: true });
  sinon.stub(smsSender, "sendSMS").returns(Promise.resolve(true));
});

describe("Unit test", () => {
  test("When adding a valid product, then get back a successful response with the product inside", async () => {
    // Arrange
    const productToAdd = {
      name: "Dracula",
      category: "books",
      vendorName: "Green-Books",
      vendorProductId: "1a-bc-23",
    };
    // Build the provider classes: SMS, data access and price calculator
    const priceCalculator = new PriceCalculator();
    const productService = new ProductService(priceCalculator);
    const dataAccessStub = sinon.stub(dataAccess);
    dataAccessStub.getVendorProductDetails.returns(
      Promise.resolve({
        popularity: 0.95,
        vendorPrice: 100,
        returnRate: 0.2,
        color: "blue",
        storageSizeInCC: 200,
        productionCountry: "China",
        productCategory: "Books",
      })
    );
    dataAccess.addProduct.returns(Promise.resolve(null));

    // Act
    const receivedResponse = await productService.addProduct(productToAdd);

    // Assert
    expect(receivedResponse).toMatchObject({
      name: "Dracula",
      category: "books",
      price: expect.any(Number),
    });
  });
});

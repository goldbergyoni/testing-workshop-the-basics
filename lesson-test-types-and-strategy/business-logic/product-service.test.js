const nock = require("nock");
const sinon = require("sinon");
const ProductService = require("./products-service");
const dataAccess = require("../data-access/data-access");

beforeEach(() => {
  sinon.restore();
});

test("When a valid product is added, then get a valid response", async () => {
  // Arrange
  const productToAdd = {
    name: "Dracula",
    category: "books",
    vendorName: "Green-Books",
    vendorProductId: "1a-bc-23",
  };
  const productService = new ProductService();
  nock("http://email-service.com").post("/api").reply(200, { succeeded: true });
  const dataAccessStub = sinon.stub(dataAccess);
  dataAccessStub.addProduct.returns(Promise.resolve(null));
  dataAccessStub.getVendorProductDetails.returns(
    Promise.resolve({
      popularity: 0.95,
      vendorPrice: 100,
      returnRate: 0.05,
      color: "blue",
      storageSizeInCC: 200,
      productionCountry: "China",
      productCategory: "Books",
    })
  );

  // Act
  const receivedResult = await productService.addProduct(productToAdd);

  // Assert
  expect(receivedResult).toMatchObject({
    name: "Dracula",
    category: "books",
    price: expect.any(Number),
  });
});

const productDataAccess = require("../data-access/data-access");
const { getTaxType } = require("./tax-classifier");
const config = require("./config");
const PriceCalculator = require("./price-calculator");

let products = [];

class ProductsService {
  doesNameExist(candidateName) {
    const sameNameProducts = products.filter((aProductToCheck) => aProductToCheck.name === candidateName);

    return sameNameProducts.length > 0;
  }

  async addProduct(productRequest) {
    // 🔏 Some validation first
    if (!productRequest.name || !productRequest.category) {
      const errorToThrow = new Error("Some properties are missing");
      errorToThrow.name = "invalidInput";
      throw errorToThrow;
    }

    let productToSave = {};
    productToSave.name = productRequest.name;
    productToSave.category = productRequest.category;

    // 💰💸 Calculate the price for
    const vendorDetails = await productDataAccess.getVendorProductDetails(
      productRequest.vendorName,
      productRequest.vendorProductId
    );

    productToSave.price = new PriceCalculator().calculatePrice(
      vendorDetails.popularity,
      vendorDetails.vendorPrice,
      config.desiredProfit,
      vendorDetails.returnRate,
      vendorDetails.storageSizeInCC,
      vendorDetails.productionCountry
    );

    // 📦 Let's save in DB
    products.push(productToSave);

    return productToSave;
  }

  async getProductsByName(name) {
    //Intentionally put timeout to make it real async like API/DB call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = products.filter((aProduct) => aProduct.name === name);
        resolve(result);
      }, 10);
    });
  }

  //Meant to demonstrate testing when callbacks exist
  async deleteProduct(name, callback) {
    const updatedProductsList = products.filter((aProductToCheck) => aProductToCheck.name !== name);
    products = updatedProductsList;
    const result = updatedProductsList ? true : false;

    callback(null, {
      succeed: result,
    });
  }
}

module.exports = ProductsService;

const axios = require("axios");
const productDataAccess = require("../data-access/data-access");
const config = require("./config");
const PriceCalculator = require("./price-calculator");
const SMSSender = require("../../lesson-test-doubles/main-exmaple/sms-sender");

class ProductsService {
  constructor(priceCalculatorProvider, dataAccessProvider, SMSProvider) {
    this.dataAccessProvider = dataAccessProvider || productDataAccess;
    this.SMSProvider = SMSProvider || SMSSender;
    this.priceCalculator = priceCalculatorProvider || new PriceCalculator();
  }

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

    // 💰💸 Calculate the price
    const vendorDetails = await productDataAccess.getVendorProductDetails(
      productRequest.vendorName,
      productRequest.vendorProductId
    );

    productToSave.price = this.priceCalculator.calculatePrice(
      vendorDetails.popularity,
      vendorDetails.vendorPrice,
      config.desiredProfit,
      vendorDetails.returnRate,
      vendorDetails.storageSizeInCC,
      vendorDetails.productionCountry
    );

    // 📦 Let's save in DB
    await this.dataAccessProvider.addProduct(productToSave);

    await axios.post(`http://email-service.com/api`, {
      title: "New product",
      body: "A new product was added",
    });
    this.SMSProvider.sendSMS("Hey, a new product was just added");

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

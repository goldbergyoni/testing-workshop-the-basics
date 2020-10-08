const axios = require("axios");
const ProductDataAccess = require("./product-data-access");
const SMSSender = require("./sms-sender");
const smsSenderInASingleFunction = require("./sms-sender-in-a-single-function");

class ProductsService {
  calculatePrice(catalogPrice, isOnSale, isPremiumUser) {
    let finalPrice = catalogPrice;

    if (isOnSale) {
      finalPrice *= 0.9;
    }

    if (isPremiumUser) {
      finalPrice *= 0.9;
    }

    //A bunch of other IF/ELSE

    return finalPrice;
  }

  calculatePriceWithConfig(catalogPrice, isOnSale, isPremiumUser) {
    let finalPrice = catalogPrice;

    if (configuration.getConfig().allowDiscount === false) {
      return catalogPrice;
    }

    if (isOnSale) {
      finalPrice *= 0.9;
    }

    if (isPremiumUser) {
      finalPrice *= 0.9;
    }

    //A bunch of other IF/ELSE

    return finalPrice;
  }

  async addProduct(name, price, category) {
    if (!name || !price) {
      const errorToThrow = new Error("Something else");
      errorToThrow.name = "invalidInput";
      throw errorToThrow;
    }

    const productToAdd = {
      name,
      price,
      category,
    };

    new ProductDataAccess().saveProduct(productToAdd);
    SMSSender.sendSMS("Hey, a new product was just added");
    await axios.post(`http://email-service.com/api`, {
      title: "New product",
      body: "A new product was added",
    });

    return {
      succeeded: true,
    };
  }
}

module.exports = ProductsService;

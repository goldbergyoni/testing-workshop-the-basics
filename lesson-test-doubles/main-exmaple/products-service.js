const axios = require("axios");
const productDataAccess = require("./product-data-access");
const SMSSenderWithSingleFunction = require("./sms-sender-in-a-single-function");
const SMSSender = require("./sms-sender");

class ProductsService {
  async getProductByName(name) {
    return await productDataAccess.getProductByName(name);
  }

  async addProduct(name, price, category, postAddHook = () => null) {
    console.log("Product service was called to add a new product");
    if (!name || !price) {
      const errorToThrow = new Error("Invalid input");
      errorToThrow.name = "invalidInput";
      throw errorToThrow;
    }

    const productToAdd = {
      name,
      price,
      category,
    };

    await productDataAccess.saveProduct(productToAdd, false);

    //Let's do some notification stuff
    try {
      const SMSResponse = SMSSender.sendSMS("Hey, a new product was just added");

    } catch (e) {
      console.log("Not crashing, still want to save the new product so", e);
    }
    await axios.post(`http://email-service.com/api`, {
      title: "New product",
      body: "A new product was added",
    });

    postAddHook();

    return {
      succeeded: true,
    };
  }
}

module.exports = ProductsService;

const axios = require("axios");
const ProductDataAccess = require("./product-data-access");
const SMSSender = require("./sms-sender");
const smsSenderInASingleFunction = require("./sms-sender-in-a-single-function");

class ProductsService {

  async addProduct(name, price, category, postAddHook = () => null) {
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

    //Let's do some notification stuff
    SMSSender.sendSMS("Hey, a new product was just added");
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
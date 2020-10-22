const axios = require("axios");
const productDataAccess = require("./product-data-access");
const defaultSMSSender = require("./sms-sender");
const smsSenderInASingleFunction = require("./sms-sender-in-a-single-function");

class ProductsService {

  constructor(customSMSProvider) {
    if (customSMSProvider) {
      this.ChosenSMSProvider = customSMSProvider;
    } else {
      this.ChosenSMSProvider = defaultSMSSender;
    }
  }

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

    productDataAccess.saveProduct(productToAdd);

    //Let's do some notification stuff
    try {
      this.ChosenSMSProvider.sendSMS("Hey, a new product was just added");
    } catch (e) {
      console.log('Not crashing, still want to save the new product so');
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
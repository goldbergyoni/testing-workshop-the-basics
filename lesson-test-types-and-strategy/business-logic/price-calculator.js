const roundTo = require("round-to");
const { getTaxType } = require("./tax-classifier");

// add-product-api {name, category, vendor-name, vendor-id}
// calculate-price {popularity, repair-cost, taxType, vendorPrice, storageVolume}

class PriceCalculator {
  calculatePrice(popularity, vendorPrice, desiredProfitRate, returnRate, storageSize, productionCountry) {
    const taxType = getTaxType(productionCountry);
    let finalPrice = vendorPrice + vendorPrice * desiredProfitRate;
    // 🌶 If this product is so popular and reliable, let's apply a big discount
    console.log("foo", taxType, popularity, returnRate);
    if (popularity > 0.9 && returnRate < 0.1 && taxType === "normal") {
      finalPrice = finalPrice * 0.8;
    }

    // 📝 Typically tons of business rules come here
    // ...

    // 🎯 Ready to format and return
    const finalPriceWithNiceFormatting = this.formatPrice(finalPrice, 2);

    return finalPriceWithNiceFormatting;
  }

  // 🦉 This is used to show that a private function and even npm packages might be part of our tests
  formatPrice(rawPrice, numberOfDigitsAfterThePoint) {
    return roundTo(rawPrice, numberOfDigitsAfterThePoint);
  }
}

module.exports = PriceCalculator;

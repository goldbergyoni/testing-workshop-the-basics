// add-product-api {name, category, vendor-name, vendor-id}
// calculate-price {popularity, repair-cost, taxType, vendorPrice, storageVolume}

class PriceCalculator {
  calculatePrice(popularity, vendorPrice, desiredProfitRate, taxType, returnRate, storageSize) {
    let finalPrice = vendorPrice + vendorPrice * desiredProfitRate;
    // 🌶 If this product is so popular and reliable, let's apply a big discount
    if (popularity > 0.9 && returnRate < 0.1 && taxType === "normal") {
      finalPrice = finalPrice * 0.8;
    }

    // 📝 Typically tons of business rules come here

    return finalPrice;
  }
}

module.exports = PriceCalculator;

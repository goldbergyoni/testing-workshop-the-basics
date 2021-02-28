const PriceCalculator = require("./price-calculator");

describe("Unit test", () => {
  test("When highly popular, low return rate and no tax restrictions, then get 20% discount", () => {
    // Arrange
    const highlyPopularRate = 0.99;
    const lowReturnRate = 0.05;
    const countryWithoutTaxRestrictions = "India";
    const basePriceBeforeDiscount = 100;
    const priceCalculator = new PriceCalculator();

    // Act
    const receivedPrice = priceCalculator.calculatePrice(
      highlyPopularRate,
      basePriceBeforeDiscount,
      0,
      lowReturnRate,
      100,
      countryWithoutTaxRestrictions
    );

    // Assert
    expect(receivedPrice).toBe(basePriceBeforeDiscount * 0.8);
  });
});

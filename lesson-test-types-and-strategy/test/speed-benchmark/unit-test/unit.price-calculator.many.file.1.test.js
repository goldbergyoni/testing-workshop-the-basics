const PriceCalculator = require("../../../business-logic/price-calculator");

describe("Main examples", () => {
  for (let index = 0; index < 25; index++) {
    test("When highly popular and low return rate, then assign 20% discount", () => {
      // Arrange
      const priceCalculator = new PriceCalculator();
      const highlyPopularRank = 0.95;
      const lowReturnRate = 0.05;

      // Act
      const receivedResult = priceCalculator.calculatePrice(highlyPopularRank, 100, 0, lowReturnRate, 1, "India");

      // Assert
      expect(receivedResult).toBe(80);
    });
  }
})

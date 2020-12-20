const { getTaxType } = require("./tax-classifier");

test("When the country has custom tax regulations, then get back special-agreement classification", () => {
  // Arrange

  // Act
  const receivedResult = getTaxType("Thailand");


  // Assert
  expect(receivedResult).toBe("special-agreement");
});

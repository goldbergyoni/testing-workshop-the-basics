// 🦉 This is used to show that a class under test (PriceCalculator) might include collaborators in a single unit test
module.exports.getTaxType = (vendorCountry) => {
  if (vendorCountry === "Thailand") {
    return "special-agreement";
  } else if (vendorCountry === "Canada") {
    return "no-tax";
  }

  return "normal";
};

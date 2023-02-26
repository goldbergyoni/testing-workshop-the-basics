const BFile = require("./b");
BFile.aStar = "⭐️";

const methodOfFileA = () => {
  try {
    const responseFromB = BFile.methodOfFileB();
    console.log(responseFromB);
    return "🌞 All good";
  } catch (e) {
    return "🤨 Error, but we're still alive";
  }
};

module.exports = methodOfFileA;

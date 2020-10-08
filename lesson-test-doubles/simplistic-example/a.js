const BFile = require("./b");

const methodOfFileA = () => {
    console.log('🤗 A')
    const responseFromB = BFile.methodOfFileB();
    console.log(responseFromB);
}

module.exports = methodOfFileA;
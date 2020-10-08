let methodOfFileA = require("./a");
const fileB = require("./b");
const sinon = require("sinon");

beforeAll(() => {
    sinon.stub(fileB, "methodOfFileB").returns('A double of file B 🤭🙈🕵🏼‍♀️')
});

test('Test file A', () => {
    methodOfFileA();
});
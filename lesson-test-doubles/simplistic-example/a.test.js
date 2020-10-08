//This file demonstrates the idea of the cached module loading system
//It show how one file can patch other file, B, and affect
//any other file that require that patched file B
const methodOfFileA = require("./a");
const fileB = require("./b");

beforeAll(() => {
    fileB.methodOfFileB = () => {
        return 'A double of file B 🤭🙈🕵🏼‍♀️';
    }
});
test('Test file A', () => {
    methodOfFileA();
});
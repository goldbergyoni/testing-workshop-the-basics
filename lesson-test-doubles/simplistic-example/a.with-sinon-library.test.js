let methodOfFileA = require("./a");
const fileB = require("./b");
const sinon = require("sinon");

beforeEach(() => {
    sinon.restore();
});

test('When all good, then the response is all good', () => {
    /// Arrange
    sinon.stub(fileB , "methodOfFileB").returns("🤭🙈🕵🏼‍♀️ A double of file B");
    sinon.clock

    // Act
    const receivedResult = methodOfFileA();

    // Assert
    expect(receivedResult).toBe("🌞 All good");
});

test('When B throws error, then no exception and the return message is still alive', () => {
    /// Arrange
    sinon.stub(fileB , "methodOfFileB").throws(new Error('something bad'));

    // Act
    const receivedResult = methodOfFileA();

    // Assert
    expect(receivedResult).toBe("🤨 Error, but we're still alive");
});
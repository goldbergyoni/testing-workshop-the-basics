//This file demonstrates the idea of the cached module loading system
//It show how one file can patch other file, B, and affect
//any other file that require that patched file B
const methodOfFileA = require("./a");
const fileB = require("./b");


test('When all good, then the response is all good', () => {
    console.log(fileB.aStar);
    /// Arrange
    fileB.methodOfFileB = () => {
        return "🤭🙈🕵🏼‍♀️ A double of file B";
    }

    // Act
    const receivedResult = methodOfFileA();

    // Assert
    expect(receivedResult).toBe("🌞 All good");
});

test('When B throws error, then no exception and the return message is still alive', () => {
    /// Arrange
    fileB.methodOfFileB = () => {
        throw new Error("something bad");
    }

    // Act
    const receivedResult = methodOfFileA();

    // Assert
    expect(receivedResult).toBe("🤨 Error, but we're still alive");
});
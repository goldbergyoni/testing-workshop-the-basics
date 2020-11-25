// 🏅 Your mission is to validate and sharpen your test doubles skills 💜
// ✅ Whenever you see this icon, there's a TASK for you
// 💡 - This is an ADVICE symbol, it will appear nearby most tasks and help you in fulfilling the tasks

const sinon = require("sinon");
const nock = require("nock");
const util = require("util");
const { TripClipService } = require("../trip-clip-service");
const WeatherProvider = require("../weather-provider");
const mailSender = require("../mail-sender");
const videoProducer = require("../video-producer");
const testHelper = require("./test-helpers");
const DataAccess = require("../data-access");

// ✅ TASK: Write a simple test against the trip clip service "generateClip" method- When valid input, then get back a valid response
//Ensure the the test pass
// 💡 TIP: Here's the test skeleton

beforeEach(() => {
  sinon.restore();
  nock.cleanAll();
  nock("http://like-youtube.com")
    .post(/upload.*$/)
    .reply(200, { status: "all-good" });
});

test("When the instructions are valid, then get back a successful response", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { name: "Yoni" },
    destination: "Mexico",
    slogan: "It was great",
  });
  const tripClipServiceUnderTest = new TripClipService();

  // Act
  const receivedResult = await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(receivedResult.succeed).toBe(true);
});

// ✅ TASK: Test that when a clip was generated successfully, an email is sent to the creator
// 💡 TIP: A spy or stub might be a good fit for this mission. What are the advantages of using stub?
test("When video instructions are valid, then a success email should be sent to creator", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const tripClipServiceUnderTest = new TripClipService();
  const spyOnMailer = sinon.stub(mailSender, "send");

  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(spyOnMailer.lastCall.args).toEqual(["yoni@testjavascript.com", expect.any(String)]);
});

// ✅ TASK: In the last test above, ensure that the right params were passed. Consider whether to check that exact values or the param existence and types
// 💡 TIP: Sometimes it's recommended not to rely on specific string that might change often and break the tests

// ✅ TASK: In the last test, ensure that the the real mailer was not called because you are charged for every outgoing email
// 💡 TIP: The mailer logs to the console, ensure that this string is not there
// 💡 TIP: If the real mailer is called, consider switching to stub

// ✅ TASK: In relation to the test above, achieve the same result with 'anonymous spy' (or anonymous stub) - Pass the anonymous test double to the constructor of the SUT
// 💡 TIP: Here's an anonymous spy syntax:
// 💡 sinon.spy() // no args passed
// 💡 Tip: There's no need to use the real email provider, we can just pass an empty function (anonymous spy/stub) and check whether it was called appropriately
// The constructor of the TripClipService welcomes custom email providers
test("When video instructions are valid, then a success email should be sent to creator (with anonymous spy)", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const spiedMailSender = { send: sinon.stub().resolves(true) }; //anonymous function 👈
  const tripClipServiceUnderTest = new TripClipService(videoProducer, WeatherProvider, spiedMailSender);

  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(spiedMailSender.send.lastCall.args).toEqual(["yoni@testjavascript.com", expect.any(String)]);
});

// ✅ TASK: The next two tests below step on each other toe - The 1st one stubs a function, never cleans up and the 2nd fails because of this. Fix it please
// 💡 TIP: It seems like a good idea to clean-up after the tests

test("When the video production fails, then no email is sent (step on toe1)", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const tripClipServiceUnderTest = new TripClipService();
  sinon.stub(videoProducer, "produce").rejects(new Error("I just failed "));
  const spyOnMailer = sinon.stub(mailSender, "send");

  // Act
  try {
    await tripClipServiceUnderTest.generateClip(clipInstructions);
  } catch (e) {
    //We don't care about the error here
  }

  // Assert
  expect(spyOnMailer.called).toBe(false);
});

test("When video instructions are valid, then a success email should be sent to creator (step on toe2)", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const tripClipServiceUnderTest = new TripClipService();
  const spyOnMailer = sinon.stub(mailSender, "send");

  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(spyOnMailer.lastCall.args).toEqual(["yoni@testjavascript.com", expect.any(String)]);
});

// ✅ TASK: Test that when the VideoProducer.produce operation operation fails, an exception is thrown
// with a property name: 'video-production-failed'
// 💡 TIP: Use a test double that can change the response of this function and trigger it to throw an error
test("When the video production fails, then video-production-failed exception is thrown", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const tripClipServiceUnderTest = new TripClipService();
  sinon.stub(videoProducer, "produce").rejects(new Error("I just failed "));

  // Act
  const generateClipOperation = () => {
    return tripClipServiceUnderTest.generateClip(clipInstructions);
  };

  // Assert
  await expect(generateClipOperation).rejects.toThrowError(
    expect.objectContaining({
      name: "video-production-failed",
    })
  );
});

// ✅ TASK: Test that when the InstructionsValidator class tells that the input is invalid, then the response is not succeeded
// 💡 TIP: We can achieve this by stubbing this class response, but do we need a test double for that? Whenever possible avoid test doubles
test("When the instructions are invalid, then the response is not succeed", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    slogan: undefined, //mandatory
  });
  const tripClipServiceUnderTest = new TripClipService();

  // Act
  const receivedResult = await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(receivedResult.succeed).toBe(false);
});

// ✅ TASK: Test that when the WeatherProvider returns null, then the result success field is false. There is one challenge
// to address - This file exports a class, not an instance. To stub it you need to tell Sinon how
// 💡 TIP: Use the following syntax:
// sinon.stub(object.prototype , "method-name")
test("When the weather provider has no answer, then the response is not succeeded", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions();
  const tripClipServiceUnderTest = new TripClipService();
  sinon.stub(WeatherProvider.prototype, "getWeather").resolves(null);

  // Act
  const receivedResult = await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(receivedResult.succeed).toBe(false);
});

// ✅ TASK: Use mocks to test that when the data access class was called, the right params are passed and it's called only one time
// After the test pass, refactor a single param in the data access class and note how the tests fails also everything still works
// 💡 TIP: Use Sinon mock fluent interface to define as many expectations as possible in a single line
test("When valid instructions are provided, then the data access is called in the right way", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions();
  const tripClipServiceUnderTest = new TripClipService();
  const dataAccessMock = sinon.mock(DataAccess.prototype);
  dataAccessMock.expects("save").exactly(1).withArgs(clipInstructions, true).resolves(true);

  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  dataAccessMock.verify();
});

// ✅ TASK: Ensure that all calls to YouTube REST service are not taking place and instead a default value is returned for all tests
// 💡 TIP: Use interceptor and apply it globally for all tests in the file

// ✅ TASK: Ensure that when YouTube REST service returns an error,  then the result success field is false
// 💡 TIP: This level of interception should happen in a specific test
// 💡 TIP: Since the request to YouTube has a dynamic string, specify the path using a RegEx -> .post('/upload.*$/')
test("When YouTube uploader fails, then the response succeed field is false", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions();
  const tripClipServiceUnderTest = new TripClipService();
  nock.cleanAll();
  nock("http://like-youtube.com")
    .post(/upload.*$/)
    .reply(500, { status: "not-good" });

  // Act
  const receivedResult = await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(receivedResult.succeed).toBe(false);
});

// ✅ TASK: By default, prevent all calls to external HTTP services so your tests won't get affected by 3rd party services
// 💡 TIP: The lib has a function that supports this

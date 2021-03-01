// 🏅 Your mission is to validate and sharpen your test doubles skills 💜
// ✅ Whenever you see this icon, there's a TASK for you
// ✅🚀 - This is an Advanced task
// 💡 - This is an ADVICE symbol, it will appear nearby most tasks and help you in fulfilling the tasks

const sinon = require("sinon");
const nock = require("nock");
const util = require("util");
jest.mock("../subtitles-provider");
const { TripClipService } = require("../trip-clip-service");
const WeatherProvider = require("../weather-provider");
const mailSender = require("../mail-sender");
const videoProducer = require("../video-producer");
const testHelper = require("./test-helpers");
const DataAccess = require("../data-access");
const subtitlesProvider = require("../subtitles-provider");

beforeAll(() => {
  nock.disableNetConnect();
});

afterEach(() => {
  sinon.restore();
  nock.cleanAll();
});

// ✅ TASK: Write a simple test against the trip clip service "generateClip" method- When valid input, then get back a valid response
//Ensure the the test pass
// 💡 TIP: Here's the test skeleton

test("When the instructions are valid, then get back a successful response", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { name: "Kavita" },
    destination: "Mexico",
  });
  const tripClipServiceUnderTest = new TripClipService();

  // Act
  const receivedResult = await tripClipServiceUnderTest.generateClip(
    clipInstructions
  );

  // Assert
  // 💡 TIP: Ensure that the result 'succeed' property is true
  expect(receivedResult.succeed).toBe(true);
});

// ✅ TASK: Test that when a clip was generated successfully, an email is sent to the creator
// 💡 TIP: A spy or stub might be a good fit for this mission. What are the advantages of using stub?
// 💡 TIP: This line creates a spy on the the mailer object: const mailerListener = sinon.spy(mailSender, "send");
test("When video instructions are valid, then a success email should be sent to creator", async () => {
  // Arrange
  const mailerListener = sinon.stub(mailSender, "send");
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const tripClipServiceUnderTest = new TripClipService();

  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  // 💡 TIP: Ensure that the stub or spy was called. mailerListener.called should be true
  expect(mailerListener.called).toBe(true);
});

// ✅ TASK: In the last test above, ensure that the right params were passed to the mailer. Consider whether to check that exact values or the param existence and types
// 💡 TIP: Sometimes it's not recommended to rely on specific string that might change often and break the tests
test("When the mailer is called the right params are passed", async () => {
  // Arrange
  const mailerListener = sinon.stub(mailSender, "send");
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });

  // Act
  const tripClipServiceUnderTest = new TripClipService();
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(
    mailerListener.withArgs("yoni@testjavascript.com", "Your video is ready")
      .calledOnce
  ).toBe(true);
});

// ✅ TASK: In the last test, ensure that the the real mailer was not called because you are charged for every outgoing email
// 💡 TIP: The mailer logs to the console, ensure that this string is not there
// 💡 TIP: If the real mailer is called, consider switching to stub
test("When the mailer is called the real service is not used", async () => {
  // Arrange
  const consoleSpy = sinon.spy(console, "log");
  const mailerListener = sinon.stub(mailSender, "send");
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });

  // Act
  const tripClipServiceUnderTest = new TripClipService();
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(consoleSpy.withArgs("Im the real mailer").called).toBe(false);
});

// ✅ TASK: In relation to the test above, achieve the same result with 'anonymous spy' (or anonymous stub) - Pass the anonymous test double to the constructor of the SUT
// 💡 TIP: Here's an anonymous spy syntax:
// 💡 sinon.spy() // no args passed
// 💡 Tip: There's no need to use the real email provider, we can just pass an empty function (anonymous spy/stub) and check whether it was called appropriately
// The constructor of the TripClipService welcomes custom email providers
test("When the mailer is called the real service is not used", async () => {
  // Arrange
  const consoleSpy = sinon.spy(console, "log");
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });

  // Act
  const tripClipServiceUnderTest = new TripClipService(
    sinon.stub({
      send: () => {},
    })
  );
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(consoleSpy.withArgs("Im the real mailer").called).toBe(false);
});

// ✅ TASK: Test that when the VideoProducer.produce operation operation fails, an exception is thrown
// with a property name: 'video-production-failed'
// 💡 TIP: Use a test double that can change the response of this function and trigger it to throw an error
// 💡 TIP: This is grey box testing, we mess with the internals but with motivation to test the OUTCOME of the box

test(`VideoProducer.produce operation operation fails, an exception is thrown with a property name: 'video-production-failed'`, async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const videoProductionErrorListener = sinon
    .stub(videoProducer, "produce")
    .rejects(new Error("video production failed"));
  const tripClipServiceUnderTest = new TripClipService();

  // Act
  const generateClipCaller = async () => {
    await tripClipServiceUnderTest.generateClip(clipInstructions);
  };

  // Assert
  expect(generateClipCaller).rejects.toThrowError(
    expect.objectContaining({
      name: "video-production-failed",
    })
  );
});

// ✅ TASK: Test that when the InstructionsValidator class tells that the input is invalid, then the response is not succeeded
// 💡 TIP: We can achieve this by stubbing this class response, but do we need a test double for that?
// 💡 TIP: Whenever possible avoid test doubles
test("When the InstructionsValidator class tells that the input is invalid, then the response is not succeeded", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
  });
  clipInstructions.slogan = "";
  const tripClipServiceUnderTest = new TripClipService();

  // Act
  const receivedResult = await tripClipServiceUnderTest.generateClip(
    clipInstructions
  );

  // Assert
  expect(receivedResult.succeed).toBe(false);
});

// ✅🚀 TASK: Test that when the WeatherProvider returns null, then the result success field is false. There is one challenge
// to address - This file exports a class, not an instance. To stub it you need to tell Sinon how
// 💡 TIP: Use the following syntax:
// sinon.stub(object.prototype , "method-name")
test("When the WeatherProvider returns null, then the result success field is false", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { name: "Kavita" },
    destination: "Mexico",
  });
  const weatherStub = sinon
    .stub(WeatherProvider.prototype, "getWeather")
    .resolves(null);
  const tripClipServiceUnderTest = new TripClipService();

  // Act
  const receivedResult = await tripClipServiceUnderTest.generateClip(
    clipInstructions
  );

  // Assert
  expect(receivedResult.succeed).toBe(false);
});

// ✅ TASK: Use mocks to test that when the data access class was called, the right params are passed and it's called only one time
// After the test pass, refactor a single param in the data access class and note how the tests fails also everything still works
// 💡 TIP: Use Sinon mock fluent interface to define as many expectations as possible in a single line

test(`When the data access class is called, the right params are passed and it's called only one time`, async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const tripClipServiceUnderTest = new TripClipService();
  const dataAccessMock = sinon
    .mock(DataAccess.prototype)
    .expects("save")
    .once(clipInstructions)
    .withArgs()
    .resolves(true);

  // Act
  const receivedResult = await tripClipServiceUnderTest.generateClip(
    clipInstructions
  );

  // Assert
  dataAccessMock.verify();
});

// ✅🚀 TASK: Ensure that when the subtitle object that is returned by 'subtitles-provider' is null, an exception is thrown
// 💡 TIP: 'subtitles-provider' exports a function, not object, Sinon might not be helpful here. Consider using Proxyquire or Jest mock
// 💡 TIP: If using Jest mock for the mission, at start *before* importing the subtitles provider, mock this module:
//  jest.mock("../subtitles-provider");
//  Then within the test, set the desired response: subtitlesProvider.mockReturnValue({your desired value});
test("When subtitles are empty, then the response succeed is false", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
  });
  // Mock imported function using jest
  subtitlesProvider.mockReturnValue(null);
  const tripClipServiceUnderTest = new TripClipService();
  process.env.MANDATORY_SUBTITLES = "true";

  // Act
  const generateClipCaller = async () => {
    await tripClipServiceUnderTest.generateClip(clipInstructions);
  };

  // Assert
  expect(generateClipCaller).rejects.toThrow();
});

// ✅ TASK: Ensure that all calls to YouTube REST service are not taking place and instead a default value is returned for all tests
// 💡 TIP: Use interceptor and apply it globally for all tests in the file

// ✅ TASK: Ensure that when YouTube REST service returns an error,  then the result success field is false
// 💡 TIP: This level of interception should happen in a specific test
// 💡 TIP: Since the request to YouTube has a dynamic string, specify the path using a RegEx -> .post('/upload.*$/')
test("When YouTube REST service returns an error, then the result success field is false", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
  });
  process.env.MANDATORY_SUBTITLES = "false";
  const tripClipServiceUnderTest = new TripClipService();
  nock.cleanAll();
  nock("http://like-youtube.com")
    .post(/upload.*$/)
    .reply(500, { status: "Internal server error" });

  // Act
  const receivedResult = await tripClipServiceUnderTest.generateClip(
    clipInstructions
  );

  // Assert
  expect(receivedResult.succeed).toBe(false);
});

// ✅🚀 TASK: By default, prevent all calls to external HTTP services so your tests won't get affected by 3rd party services
// 💡 TIP: The lib has a function that supports this
// nock.disableNetConnect(); was specified at beforeAll block

beforeEach(() => {
  // 💡 TIP: Leave this code, it's required to prevent access to the real YouTube
  nock("http://like-youtube.com")
    .post(/upload.*$/)
    .reply(200, { status: "all-good" });
});

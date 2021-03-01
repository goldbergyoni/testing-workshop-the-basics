// 🏅 Your mission is to validate and sharpen your test doubles skills 💜
// ✅ Whenever you see this icon, there's a TASK for you
// ✅🚀 - This is an Advanced task
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
let subtitlesProvider = require("../subtitles-provider");

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
  const receivedResult = await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  //  💡 TIP: Ensure that the result 'succeed' property is true
});

// ✅ TASK: Test that when a clip was generated successfully, an email is sent to the creator
// 💡 TIP: A spy or stub might be a good fit for this mission. What are the advantages of using stub?
// 💡 TIP: This line creates a spy on the the mailer object: const mailerListener = sinon.spy(mailSender, "send");
test("When video instructions are valid, then a success email should be sent to creator", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const tripClipServiceUnderTest = new TripClipService();
  const spyOnMailer = sinon.spy(mailSender, "send");
  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(spyOnMailer.called).toBe(true);
  spyOnMailer.restore();
});

it("spyOnMailer ensure that the right params were passed. ", async () => {
  // Arrange
  // const spyOnMailer = sinon.spy(mailSender, "send");
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const tripClipServiceUnderTest = new TripClipService();
  const spyOnMailer = sinon.spy(mailSender, "send");
  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(spyOnMailer.called).toBe(true);
  expect(spyOnMailer.withArgs('yoni@testjavascript.com').calledOnce).toBe(true);
  spyOnMailer.restore();
});

it("In relation to the test above, achieve the same result with 'anonymous spy' (or anonymous stub) - Pass the anonymous test double to the constructor of the SUT", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
  });
  const anonymousMailSender = {
    send: sinon.stub().resolves()
  };
  const spyOnMailer = sinon.spy(mailSender, 'send');
  const tripClipServiceUnderTest = new TripClipService(anonymousMailSender);
  process.env.MANDATORY_SUBTITLES = "true";
  // Act
  const response = await tripClipServiceUnderTest.generateClip(clipInstructions);
  // Assert
  expect(spyOnMailer.called).toBe(false);
  expect(response).toEqual({
    "instructionsValidation": {
      "failures": [],
      "succeeded": true,
    },
    "succeed": true,
    "videoURL": "undefined",
  });
  spyOnMailer.restore();
})

it("Test that when the VideoProducer.produce operation operation fails, an exception is thrown", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { name: "Yoni" },
    destination: "Mexico",
  });
  const expectedError = new Error('video production failed');
  const video = sinon.stub(videoProducer, 'produce').rejects((expectedError));
  const tripClipServiceUnderTest = new TripClipService();

  // Act
  const response = tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(response).rejects.toThrow('video production failed');

})

// ✅🚀 TASK: Ensure that when the subtitle object that is returned by 'subtitles-provider' is null, an exception is thrown
// 💡 TIP: 'subtitles-provider' exports a function, not object, Sinon might not be helpful here. Consider using Proxyquire or Jest mock
// 💡 TIP: If using Jest mock for the mission, at start *before* importing the subtitles provider, mock this module:
//  jest.mock("../subtitles-provider");
//  Then within the test, set the desired response: subtitlesProvider.mockReturnValue({your desired value});

it("Ensure that when the subtitle object that is returned by 'subtitles-provider' is null, an exception is thrown", async () => {
  // Arrange
  subtitlesProvider = jest.fn();
  subtitlesProvider.mockReturnValue(null);
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const tripClipServiceUnderTest = new TripClipService();

  try {
    // Act
    await tripClipServiceUnderTest.generateClip(clipInstructions);
  } catch (error) {
    // Assert
    expect(error.message).toBeDefined();
  }
})
// ✅ TASK: Ensure that all calls to YouTube REST service are not taking place and instead a default value is returned for all tests
// 💡 TIP: Use interceptor and apply it globally for all tests in the file

// ✅ TASK: Ensure that when YouTube REST service returns an error,  then the result success field is false
// 💡 TIP: This level of interception should happen in a specific test
// 💡 TIP: Since the request to YouTube has a dynamic string, specify the path using a RegEx -> .post('/upload.*$/')



it("Ensure that all calls to YouTube REST service are not taking place and instead a default value", async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: "yoni@testjavascript.com", name: "Yoni" },
    destination: "Mexico",
  });
  const tripClipServiceUnderTest = new TripClipService();
  nock.cleanAll();
  nock("http://like-youtube.com")
    .post(/upload.*$/)
    .reply(500, { status: "Internal server error" });

  // Act
  const responseApi = await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  expect(responseApi.succeed).toBe(false);
})

// ✅🚀 TASK: By default, prevent all calls to external HTTP services so your tests won't get affected by 3rd party services
// 💡 TIP: The lib has a function that supports this



beforeEach(() => {
  // 💡 TIP: Leave this code, it's required to prevent access to the real YouTube
  nock("http://like-youtube.com")
    .post(/upload.*$/)
    .reply(200, { status: "all-good" });
  jest.mock("../subtitles-provider");
});

afterEach(() => {
  nock.cleanAll();
  sinon.restore();
});

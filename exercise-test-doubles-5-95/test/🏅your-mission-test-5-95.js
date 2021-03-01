// 🏅 Your mission is to validate and sharpen your test doubles skills 💜
// ✅ Whenever you see this icon, there's a TASK for you
// ✅🚀 - This is an Advanced task
// 💡 - This is an ADVICE symbol, it will appear nearby most tasks and help you in fulfilling the tasks

const sinon = require('sinon');
const nock = require('nock');
const util = require('util');
const { TripClipService } = require('../trip-clip-service');
const WeatherProvider = require('../weather-provider');
const mailSender = require('../mail-sender');
const videoProducer = require('../video-producer');
const testHelper = require('./test-helpers');
const DataAccess = require('../data-access');
const instructionsValidator = require('../instructions-validator');

// ✅ TASK: Write a simple test against the trip clip service "generateClip" method- When valid input, then get back a valid response
//Ensure the the test pass
// 💡 TIP: Here's the test skeleton

test('When the instructions are valid, then get back a successful response', async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { name: 'Kavita' },
    destination: 'Mexico',
  });
  const tripClipServiceUnderTest = new TripClipService();
  sinon.spy(mailSender, 'send');
  // Act
  const receivedResult = await tripClipServiceUnderTest.generateClip(
    clipInstructions,
  );
  // Assert
  expect(receivedResult.succeed).toBe(true);
  //  💡 TIP: Ensure that the result 'succeed' property is true
});

// ✅ TASK: Test that when a clip was generated successfully, an email is sent to the creator
// 💡 TIP: A spy or stub might be a good fit for this mission. What are the advantages of using stub?
// 💡 TIP: This line creates a spy on the the mailer object: const mailerListener = sinon.spy(mailSender, "send");
test('When video instructions are valid, then a success email should be sent to creator', async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: 'yoni@testjavascript.com', name: 'Yoni' },
    destination: 'Mexico',
  });
  const tripClipServiceUnderTest = new TripClipService();
  const spyOnMailer = sinon.spy(mailSender, 'send');

  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  // 💡 TIP: Ensure that the stub or spy was called. mailerListener.called should be true
  expect(spyOnMailer.called).toBeTruthy();
});

// ✅ TASK: In the last test above, ensure that the right params were passed to the mailer. Consider whether to check that exact values or the param existence and types
// 💡 TIP: Sometimes it's not recommended to rely on specific string that might change often and break the tests
test('should video instructions are valid, then a success email should be sent to creator with the right params', async () => {
  const mockParams = {
    creator: { email: 'yoni@testjavascript.com', name: 'Yoni' },
    destination: 'Mexico',
  };
  const clipInstructions = testHelper.factorClipInstructions(mockParams);
  const tripClipServiceUnderTest = new TripClipService();
  const stubOnMailer = sinon.stub(mailSender, 'send');
  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  // 💡 TIP: Ensure that the stub or spy was called. mailerListener.called should be true
  expect(stubOnMailer.withArgs(mockParams)).toBeTruthy();
});

// ✅ TASK: In the last test, ensure that the the real mailer was not called because you are charged for every outgoing email
// 💡 TIP: The mailer logs to the console, ensure that this string is not there
// 💡 TIP: If the real mailer is called, consider switching to stub

test('should ensure that the the real mailer was not called because you are charged for every outgoing email', async () => {
  const mockParams = {
    creator: { email: 'yoni@testjavascript.com', name: 'Yoni' },
    destination: 'Mexico',
  };
  const clipInstructions = testHelper.factorClipInstructions(mockParams);
  const tripClipServiceUnderTest = new TripClipService();
  sinon.stub(mailSender, 'send');
  const spyOnConsole = sinon.spy(console, 'log');
  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  // 💡 TIP: Ensure that the stub or spy was called. mailerListener.called should be true
  expect(spyOnConsole.withArgs('Im the real mailer').called).toBe(false);
});

// ✅ TASK: In relation to the test above, achieve the same result with 'anonymous spy' (or anonymous stub) - Pass the anonymous test double to the constructor of the SUT
// 💡 TIP: Here's an anonymous spy syntax:
// 💡 sinon.spy() // no args passed
// 💡 Tip: There's no need to use the real email provider, we can just pass an empty function (anonymous spy/stub) and check whether it was called appropriately
// The constructor of the TripClipService welcomes custom email providers
test('should ensure that the the real mailer was not called because you are charged for every outgoing email', async () => {
  const mockParams = {
    creator: { email: 'yoni@testjavascript.com', name: 'Yoni' },
    destination: 'Mexico',
  };
  const clipInstructions = testHelper.factorClipInstructions(mockParams);
  const tripClipServiceUnderTest = new TripClipService();
  sinon.stub(mailSender, 'send');
  const spyFn = sinon.spy();
  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  // Assert
  // 💡 TIP: Ensure that the stub or spy was called. mailerListener.called should be true
  expect(spyFn.called).toBe(false);
});
// ✅ TASK: The next two tests below step on each other toe - The 1st one stubs a function, never cleans up and the 2nd fails because of this. Fix it please
// 💡 TIP: It seems like a good idea to clean-up after the tests

// ✅ TASK: Test that when the VideoProducer.produce operation operation fails, an exception is thrown
// with a property name: 'video-production-failed'
// 💡 TIP: Use a test double that can change the response of this function and trigger it to throw an error
// 💡 TIP: This is grey box testing, we mess with the internals but with motivation to test the OUTCOME of the box
test('should the VideoProducer.produce operation operation fails, an exception is thrown ', async () => {
  const mockParams = {
    creator: { email: 'yoni@testjavascript.com', name: 'Yoni' },
    destination: 'Mexico',
  };
  const clipInstructions = testHelper.factorClipInstructions(mockParams);
  const tripClipServiceUnderTest = new TripClipService();
  const videoStub = sinon
    .stub(videoProducer, 'produce')
    .returns('video-production-failed');
  // const spyFn = sinon.spy();
  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  expect(videoStub.returnValues).toEqual(['video-production-failed']);
});

// ✅ TASK: Test that when the InstructionsValidator class tells that the input is invalid, then the response is not succeeded
// 💡 TIP: We can achieve this by stubbing this class response, but do we need a test double for that?
// 💡 TIP: Whenever possible avoid test doubles
test('should the InstructionsValidator class tells that the input is invalid, then the response is not succeeded ', async () => {
  const mockParams = {
    creator: { email: 'yoni@testjavascript.com', name: 'Yoni' },
    destination: 'Mexico',
  };
  const clipInstructions = testHelper.factorClipInstructions(mockParams);
  const tripClipServiceUnderTest = new TripClipService();
  const instructionStub = sinon
    .stub(instructionsValidator, 'validate')
    .returns(['no-slogan', 'no-photos']);
  // .returns('video-production-failed');
  // const spyFn = sinon.spy();
  // Act
  await tripClipServiceUnderTest.generateClip(clipInstructions);

  expect(instructionStub.returnValues).toEqual([['no-slogan', 'no-photos']]);
});

// ✅🚀 TASK: Test that when the WeatherProvider returns null, then the result success field is false. There is one challenge
// to address - This file exports a class, not an instance. To stub it you need to tell Sinon how
// 💡 TIP: Use the following syntax:
// sinon.stub(object.prototype , "method-name")

// ✅ TASK: Use mocks to test that when the data access class was called, the right params are passed and it's called only one time
// After the test pass, refactor a single param in the data access class and note how the tests fails also everything still works
// 💡 TIP: Use Sinon mock fluent interface to define as many expectations as possible in a single line

// ✅🚀 TASK: Ensure that when the subtitle object that is returned by 'subtitles-provider' is null, an exception is thrown
// 💡 TIP: 'subtitles-provider' exports a function, not object, Sinon might not be helpful here. Consider using Proxyquire or Jest mock
// 💡 TIP: If using Jest mock for the mission, at start *before* importing the subtitles provider, mock this module:
//  jest.mock("../subtitles-provider");
//  Then within the test, set the desired response: subtitlesProvider.mockReturnValue({your desired value});
test('When subtitles are empty, then the response succeed is false', async () => {
  // Arrange
  const clipInstructions = testHelper.factorClipInstructions({
    creator: { email: 'yoni@testjavascript.com', name: 'Yoni' },
  });
  const tripClipServiceUnderTest = new TripClipService();
  process.env.MANDATORY_SUBTITLES = 'true';

  // Act

  // Assert
});

// ✅ TASK: Ensure that all calls to YouTube REST service are not taking place and instead a default value is returned for all tests
// 💡 TIP: Use interceptor and apply it globally for all tests in the file

// ✅ TASK: Ensure that when YouTube REST service returns an error,  then the result success field is false
// 💡 TIP: This level of interception should happen in a specific test
// 💡 TIP: Since the request to YouTube has a dynamic string, specify the path using a RegEx -> .post('/upload.*$/')

// ✅🚀 TASK: By default, prevent all calls to external HTTP services so your tests won't get affected by 3rd party services
// 💡 TIP: The lib has a function that supports this

beforeEach(() => {
  // 💡 TIP: Leave this code, it's required to prevent access to the real YouTube
  // const spyOnMailer = sinon.stub(mailSender, 'send');
  nock('http://like-youtube.com')
    .post(/upload.*$/)
    .reply(200, { status: 'all-good' });
});

afterEach(() => {
  nock.cleanAll();
  sinon.restore();
});

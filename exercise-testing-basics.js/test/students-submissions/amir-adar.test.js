// 🏅 Your mission is to create your first tests here 💜
// ✅ Whenever you see this icon, there's a TASK for you
// 💡 - This is an ADVICE symbol, it will appear nearby most tasks and help you in fulfilling the tasks

const testHelper = require('../test-helpers')
const UserService = require('../../users-service')
const jestExtended = require('jest-extended')

// ✅ TASK: Run this file tests, you should see at least see this simple test below 👇 pass
// 💡 TIP: This is how to achieve this:
// ⓵ Open your IDE terminal
// ⓶ Run the command 'npm run test:dev'
// ⓷ Within the terminal, type the letter 'p', this allows you to filter tests by the file name. Now type this file name and click 'Enter'
// 💡Another option - If you prefer not to run tests in Watch mode, just type 'npm test -- mission'

describe("First test", () => {
  test("👶🏽 This is a playground test 🚂", () => {
    expect(true).toBe(true);
    expect({ a: 1, b: 2, c: 3 }).toMatchObject({ b: 2 });
    expect({ a: 1, b: 2, c: 3 }).not.toEqual({ b: 2 });
    expect({ a: 1, b: 2, c: 3 }).toEqual({ a: 1, b: 2, c: 3 });
  });
});

// ✅ TASK: Wrap this simple test above with a 'describe' statement
// 💡 TIP: Start typing 'describe' and your IDE should suggest auto-completion
// 💡 TIP: This the syntax of describe: describe('', () => {//test comes here});

// ✅ TASK: Add your first test 🎉. This test should not test real code, just choose a title and put one hard-coded assertion (expect)
// 💡 TIP: At minimum your assertion might look like: expect(true).toBe(true)
// 💡 Try multiple assertions type to get familiar with the expect API

// ✅ TASK: Test the 'validateUser' method of the 'usersService': Ensure that when no 'name' property is provided,
//    the response 'succeeded' property is false. Remember the fail-first principle, ensure the test fail when appropriate
// 💡 TIP: Here's a valid user object to pass. Remove the property name from this object.

describe("Validate user test", () => {
  test("When adding a new user without a name, then get back false response with explanation", () => {

    /// Arrange
    const userExampleWithNoName = {
      name: undefined,
      familyName: "Beck",
      zipCode: "32486-01",
      address: "Moonlight road 181, Alaska",
    };
    const userServiceTest = new UserService();

    /// Act
    const receivedResult = userServiceTest.validateUser(userExampleWithNoName);

    /// Assert
    expect(receivedResult.succeeded).toBe(false);
    expect(receivedResult.reasons).toIncludeSameMembers(['no-name']);
    // expect(receivedResult.succeeded).toIncludeSameMembers(false);

    expect(receivedResult).toMatchObject({succeeded:false, reasons: ['no-name']});

  });

  // ✅ TASK: Use the AAA pattern in the test you just coded above ☝🏻
  // 💡 TIP: Put 3 sections within the test (appear below). In each one of them, place the appropriate parts
  // Arrange
  // Act
  // Assert

  // ✅ TASK: Currently this file contains 3 test, run just one of of those and ignore all the others
  // 💡 TIP: There are two options to achieve this, try both:
  // ⓵ Add the word .skip to the target test. For example: test.skip("test name", () => {})
  // ⓶ Preferred way: Use jest watch tools. Run the tests with 'npm run test:dev', now type the letter 't',
  //   this allows you to filter tests by test name. Now type the desired test name and click 'Enter'

  //🎖 CONGRATS. You are now familiar with the basics of testing. 'A journey of a thousand miles begins with a single step' 🤗

  // ✅ TASK: Create another test against the 'validateUser' method of the 'usersService':
  //    Provide all the mandatory field and ensure that the response is satisfactory (as expected)
  // 💡 TIP: The response contains two relevant fields to check upon, check both. Use a single assertion to check both fields!

  test("Test the validation user with all the mandatory field ", () => {

    /// Arrange
    const userExampleWithAllMandatory = {
      name: "Amir",
      familyName: "Beck",
      zipCode: "32486-01",
      address: "Moonlight road 181, Alaska",
    };
    const userServiceTest = new UserService();

    /// Act
    const receivedResult = userServiceTest.validateUser(
      userExampleWithAllMandatory
    );

    /// Assert
    expect(receivedResult.succeeded).toBe(true);
    expect(receivedResult.reasons.length).toBe(0);
  });

  // ✅ TASK: Create another test against the 'validateUser' method of the 'usersService':
  //    Don't pass at least two mandatory properties, and ensure that the response.succeeded is false
  //    but also that the 'reasons' array has ALL the right reasons inside
  // 💡 TIP: The npm package jest-extended' has a nice assertion method, '.toIncludeAllMembers([members])', that might help here:
  //    https://github.com/jest-community/jest-extended#toincludeallmembersmembers
  test("Test the validation user with no mandatory field ", () => {
    
    /// Arrange
    const userExampleWithNoFields = {};
    const userServiceTest = new UserService();

    /// Act
    const receivedResult = userServiceTest.validateUser(
      userExampleWithNoFields
    );

    /// Assert
    expect(receivedResult.succeeded).toBe(false);
    expect(receivedResult.reasons.length).toBe(2);
    expect(receivedResult.reasons).toIncludeAllMembers([
      "no-name",
      "no-location",
    ]);
  });
});

// 🏅 Your mission is to create your first tests here 💜
// ✅ Whenever you see this icon, there's a TASK for you
// 💡 - This is an ADVICE symbol, it will appear nearby most tasks and help you in fulfilling the tasks

const testHelper = require("./test-helpers");
const usersService = require("../users-service");
const jestExtended = require("jest-extended");

// ✅ TASK: Run this file tests, you should see at least see this simple test below 👇 pass
// 💡 TIP: This is how to achieve this:
// ⓵ Open your IDE terminal
// ⓶ Run the command 'npm run test:dev'
// ⓷ Within the terminal, type the letter 'p', this allows you to filter tests by the file name. Now type this file name and click 'Enter'
// 💡Another option - If you prefer not to run tests in Watch mode, just type 'npm test -- mission'

describe("This is the general descriptions for the tests", () => {
	test("👶🏽 This is a playground test 🚂", () => {
		expect(true).toBe(true);
		// ✅ TASK: Wrap this simple test above with a 'describe' statement
	});
});

describe("Writing another exampe to excercise writing assertions", () => {
	test("Another example test", () => {
		expect(true).toBe(true);
		expect(42).not.toBe(52);
		expect(4 !== 3).toBeTruthy();
		expect(-200).toBeLessThan(1);
		expect({ name: "Yoav" }).toEqual({ name: "Yoav" });
		expect(-4 + 7).not.toBeNegative();
		expect.assertions(8);
		expect(new Number()).toBeInstanceOf(Number);
		expect([][2]).toBeUndefined();
		// ✅ TASK: Add your first test 🎉. This test should not test real code, just choose a title and put one hard-coded assertion (expect)
	});
});

const userExample = {
	name: "Kent",
	familyName: "Beck",
	zipCode: "32486-01",
	address: "Moonlight road 181, Alaska",
};

describe("Testing the 'validateUser' method of 'userService'", () => {
	test("When no name provided, then validation should fail with false response", () => {
		//Arrange
		const userWithNoName = {
			familyName: "Beck",
			zipCode: "32486-01",
			address: "Moonlight road 181, Alaska",
		};
		const userServiceUnderTest = new usersService();

		//Act
		const recievedResult = userServiceUnderTest.validateUser(userWithNoName);

		//Assert
		expect(recievedResult.succeeded).toBe(false);
		// ✅ TASK: Test the 'validateUser' method of the 'usersService': Ensure that when no 'name' property is provided,
		//    the response 'succeeded' property is false. Remember the fail-first principle, ensure the test fail when appropriate
		// ✅ TASK: Use the AAA pattern in the test you just coded above ☝🏻
		// 💡 TIP: Put 3 sections within the test (appear below). In each one of them, place the appropriate parts
	});
});

describe("Testing the 'validateUser' method of 'usersService'", () => {
	test("Testing that the response is satisfactory", () => {
		//Arrange
		const fullUserExample = {
			name: "Kent",
			familyName: "Beck",
			zipCode: "32486-01",
			address: "Moonlight road 181, Alaska",
		};
		const userServiceUnderTest = new usersService();

		//Act
		const recievedResult = userServiceUnderTest.validateUser(fullUserExample);

		//Assert
		expect(recievedResult).toEqual({
			succeeded: true,
			reasons: [],
		});
		// ✅ TASK: Create another test against the 'validateUser' method of the 'usersService':
		//    Provide all the mandatory field and ensure that the response is satisfactory (as expected)
	});

	test("Testing the 'reasons' array against missing properties in the 'validateUser' method of 'usersService'", () => {
		//Arrange
		const UserExampleWithMissingProperties = {
			name: "Kent",
			address: "Moonlight road 181, Alaska",
		};
		const userServiceUnderTest = new usersService();

		//Act
		const recievedResult = userServiceUnderTest.validateUser(
			UserExampleWithMissingProperties
		);

		//Assert
		expect(recievedResult.reasons).toIncludeAllMembers(["no-name"]);
		// ✅ TASK: Create another test against the 'validateUser' method of the 'usersService':
		//    Don't pass at least two mandatory properties, and ensure that the response.succeeded is false
		//    but also that the 'reasons' array has ALL the right reasons inside
	});

	test("'validateUser' method shoul throw an error when no arguments are passed", () => {
		//Arrange
		const userServiceUnderTest = new usersService();

		//Act
		// QUESTION: is there an act stage in this case?

		//Assert
		expect(() => userServiceUnderTest.validateUser()).toThrow(
			"No user was provided"
		);
		// ✅ TASK: Create another test against the 'validateUser' method of the 'usersService':
		//    Don't pass anything to the function and ensure it throws back an exception
	});
});

describe("Testing the 'addUser' method of 'userService'", () => {
	test("'addUser' method should return true when given valid input", async () => {
		//Arrange
		const userServiceUnderTest = new usersService();
		const fullUserExample = {
			name: "Kent",
			familyName: "Beck",
			zipCode: "32486-01",
			address: "Moonlight road 181, Alaska",
		};

		//Act
		const recievedResult = await userServiceUnderTest.addNewUser(
			fullUserExample
		);

		//Assert
		expect(recievedResult).toBe(true);
	});
	// ✅ TASK: Create the first test against the 'addUser' method of the 'usersService':
	//    Pass a valid input and expect a positive response back
});

describe("Testing the 'deleteUser' method of the 'usersService'", () => {
	test("'deleteUser' method should return a positive response when user is deleted", async (done) => {
		//Arrange
		const userServiceUnderTest = new usersService();
		const fullUserExample = {
			name: "Kent",
			familyName: "Beck",
			zipCode: "32486-01",
			address: "Moonlight road 181, Alaska",
		};
		await userServiceUnderTest.addNewUser(fullUserExample);

		//Act
		userServiceUnderTest.deleteUser("Kent", (param1, param2) => {
			//Assert
			expect(param2.succeed).toBe(true);
			done();
		});

		//I have to say - it took me a while to understand what is going on here, and going through
		//the soultions to actually get it right.
		//What i don't get is WHY this is how we test these type of methods? how can i pass a non declared
		//function to the test? why am i calling it after the assertion? why am i asserting inside the method?
		//I assume that those explanations will come in upcoming videos but at the moment (i will definetly look into it on my own) i feel a bit lost
	});
	// ✅ TASK: Create the first test against the 'deleteUser' method of the 'usersService':
	//    ensure than a user is deleted the response is positive
});

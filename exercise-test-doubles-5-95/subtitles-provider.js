// Simulates a service that returns a function, not object, which is harder to stub
module.exports = async (clipInstructions) => {
  return [{ from: 1, to: 3, text: "Welcome" }]; // Meaningless result of course
};

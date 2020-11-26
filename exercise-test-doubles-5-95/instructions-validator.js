module.exports = {
  validate: function (instructions) {
    const result = {
      succeeded: false,
      failures: [],
    };
    if (!instructions.slogan) {
      result.failures.push("no-slogan");
    }
    if (instructions.photos.length === 0) {
      result.failures.push("no-photos");
    }
    if (instructions.tips.length === 0) {
      result.failures.push("no-tips");
    }
    if (result.failures.length === 0) {
      result.succeeded = true;
    }

    return result;
  },
};

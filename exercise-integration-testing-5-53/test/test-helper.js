function axiosStatusCodeConfig() {
  const config = {
    validateStatus: () => true,
  };
  return config;
}

function generateEventForTesting(numOfEvents, category) {
  const events = [];
  for (let i = 0; i < numOfEvents; i++) {
    events.push({
      category: `${category}`,
      temperature: 20,
      name: `${Math.random()*1000}`, //This must be unique
      color: "Green",
      weight: "80 gram",
      status: "active",
    });
  }
  return events;
}

module.exports = {axiosStatusCodeConfig, generateEventForTesting};

const countriesList = require("countries-list");

module.exports = {
  factorClipInstructions: (overrides) => {
    const today = new Date();
    return Object.assign(
      {
        creator: {
          name: "Yoni Goldberg",
          email: "yoni@testjavascript.com",
        },
        destination: countriesList.countries.US,
        startDate: new Date(new Date().setDate(today.getDate() + 7)),
        endDate: new Date(new Date().setDate(today.getDate() + 30)),
        photos: ["beach.jpg"],
        tips: ["Must eat at the Italian restaurant!"],
        slogan: "It was amazing",
        background: "green-grass",
      },
      overrides
    );
  },
  getVideoBackgrounds: () => ["clouds", "beautiful-beach", "green-grass", "desertish-yellow", "bionic-meteors"],
};

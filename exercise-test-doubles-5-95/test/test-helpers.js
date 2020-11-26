const countriesList = require('countries-list')

module.exports = {
    factorClipInstructions: (overrides) => {
        return Object.assign({
            creator: {
                name: "Yoni Goldberg",
                email: "yoni@testjavascript.com"
            },
            destination: countriesList.countries.US,
            startDate: '30/12/2019',
            endDate: '02/02/2020',
            photos: ['beach.jpg'],
            tips: ['Must eat at the Italian restaurant!'],
            slogan: 'It was amazing',
            background: 'green-grass'
        }, overrides);
    },
    getVideoBackgrounds: () => ['clouds', 'beautiful-beach', 'green-grass', 'desertish-yellow', 'bionic-meteors']
}
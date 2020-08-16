const databaseStarter = require('./misc/databaseStarter')

module.exports = () => {
    console.log('🚩 global teardown');
    databaseStarter.stopDB();
}
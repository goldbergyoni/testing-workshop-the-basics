const databaseStarter = require('./misc/databaseStarter')

module.exports = () => {
    //console.log('🚩 global setup')
    databaseStarter.startDB();
}
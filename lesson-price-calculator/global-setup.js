const databaseStarter = require('./misc/databaseStarter')

module.exports = () => {
    process.env.TZ = 'UTC';

    //console.log('🚩 global setup')
    databaseStarter.startDB();
}
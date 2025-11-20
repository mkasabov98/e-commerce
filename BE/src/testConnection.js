const sequelize = require('./config/database.js');

async function testConnection () {
    try {
        await sequelize.authenticate();
        console.log('happyyyyy')
    } catch {
        console.log('not happyyyy')
    }
}

testConnection();
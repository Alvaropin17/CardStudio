require('dotenv').config();


const app = require('./app');



module.exports = {
    app:{
        port: process.env.PORT || 3000,
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '1234password?',
        database: process.env.MYSQL_DB || 'appdatabase'
    }
}
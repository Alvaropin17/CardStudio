const express = require('express');
const config = require('./config')

const users = require('./controllers/userController')

const app = express();
app.use(express.json());


app.set('port', config.app.port);

app.use('/api/users', users);


module.exports = app;
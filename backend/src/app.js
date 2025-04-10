const express = require('express');
const config = require('./config')

const userController = require('./modules/users/userController')
const loginController = require('./modules/auth/authController')

const app = express();
app.use(express.json());


app.set('port', config.app.port);

app.use('/api/users', userController);
app.use('/api/auth', loginController);


module.exports = app;
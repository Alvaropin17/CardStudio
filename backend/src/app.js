const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./database/connections/mongoDb'); 

const config = require('./config')

const userController = require('./modules/users/userController')
const loginController = require('./modules/auth/authController')


const app = express();


app.use(cors({
    origin: 'http://localhost:4200',  
    credentials: true            
  }));
app.use(express.json());
app.use(cookieParser());



app.set('port', config.app.port);

app.use('/api/users', userController);
app.use('/api/auth', loginController);


module.exports = app;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('./database/connections/mongoDb'); 

const config = require('./config')

const userController = require('./modules/users/userController')
const loginController = require('./modules/auth/authController')



const app = express();


app.use(cors({
    origin: 'http://localhost:3000',  
    credentials: true            
  }));
app.use(express.json());
app.use(cookieParser());



app.set('port', config.app.port);

app.use('/api/users', userController);
app.use('/api/auth', loginController);

const angularDistPath = path.join(__dirname, 'public');  // Asumiendo que aquí copiarás Angular
app.use(express.static(angularDistPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(angularDistPath, 'index.html'));
});

module.exports = app;
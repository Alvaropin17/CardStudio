const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const path = require('path');

const config = require('./config')

const userController = require('./modules/users/userController')
const loginController = require('./modules/auth/authController')



const app = express();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '../key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../cert.pem')),
};

app.use(cors({
    origin: 'https://localhost:8443',  
    credentials: true            
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());



app.set('port', config.app.port);

app.use('/api/users', userController);
app.use('/api/auth', loginController);

const angularDistPath = path.join(__dirname, 'public');
app.use(express.static(angularDistPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(angularDistPath, 'index.html'));
});

const server = https.createServer(httpsOptions, app);

module.exports = { app, server };
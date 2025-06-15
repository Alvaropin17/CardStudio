const { server } = require('./app');
const http = require('http');


const HTTP_PORT = 80;    
const HTTPS_PORT = 8443;  

// 1. Servidor HTTPS principal
server.listen(HTTPS_PORT, () => {
  console.log(`Servidor HTTPS corriendo en https://localhost:${HTTPS_PORT}`);
}).on('error', (err) => {
  console.error('Error al iniciar servidor:', err);
});


http.createServer((req, res) => {
  res.writeHead(301, { 
    "Location": `https://localhost:8443${req.url}`
  });
  res.end();
}).listen(HTTP_PORT, () => {
  console.log(`Redirección HTTP → HTTPS en http://localhost:${HTTP_PORT}`);
});
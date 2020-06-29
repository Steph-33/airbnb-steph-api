// Importation des modules NPM
const express = require('express');
const morgan = require('morgan'); // Logger qui check nos routes

const router = require('./routes');

const server = express();

// Utilisation du logger
server.use(morgan('dev'));

server.use('/api', router);

// Écoute du serveur sur le port 8000 "http://locahost:8000"
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port ${PORT} 🚀`);
});

module.exports = server;
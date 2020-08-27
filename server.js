// Importation des modules NPM
const express = require('express');
const morgan = require('morgan'); // Logger qui check nos routes
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes');

const server = express();

const { notFoundHandler, errorLogger, errorHandler } = require('./middlewares');

server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Utilisation du logger
server.use(morgan('dev'));

server.use('/api', router);

server.use('*', notFoundHandler);
server.use(errorLogger);
server.use(errorHandler);

// Écoute du serveur sur le port 8000 "http://locahost:8000"
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port ${PORT} 🚀`);
});

module.exports = server;

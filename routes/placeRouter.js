const express = require('express');
const authController = require('../controllers/authController');
const placeController = require('../controllers/placesController');
const jwtUtils = require('../utils/jwt.utils');
require('express-async-errors');

const placesRouter = express.Router();

placesRouter.get('/places/:id', placeController.getPlaceById);

placesRouter.get('/places', placeController.getAllPlaces);

placesRouter.post('/places', (req, res) => {
  let userSession = {};
  authController.getUserSession(req, res, (userInfos) => {
    userSession = userInfos;
    if (userSession.role !== 'host') {
      return res.status(403).json({
        Message: "Vous n'êtes pas autorisé à accéder à cette ressource ❌",
      });
    }
    placeController.addPlace(req, res, userSession);
  });
});

module.exports = placesRouter;

const { expect } = require('chai');
const sinon = require('sinon');
var mocks = require('node-mocks-http');

const placesController = require('../controllers/placesController');
const db = require('../models');
const Place = db.Place;

let res = mocks.createResponse();
let userSession = {
  id: 12,
  role: 'host',
};
const req = {};

describe('Controllers :: PlacesController :: Unit', () => {
  describe('#addPlace', () => {
    it('should return the right object', () => {
      // Given
      const data = {
        title: 'Un joli coin de paradis',
        description: 'Joli 2 pièces',
        rooms: 2,
        bathrooms: 1,
        max_guests: 3,
        price_by_night: 250,
        image:
          'https://www.morningcroissant.fr/medialibrary/flats/289526/cache/crop.ae855db398f9219a1445b30660433f94-17678_650x429.jpeg',
        city_id: 1,
        host_id: 2,
      };

      req.body = data;

      const createReturnObject = {
        id: 42,
        city: 'Paris',
        title: 'Un joli coin de paradis',
        description: 'Joli 2 pièces',
        rooms: 2,
        bathrooms: 1,
        max_guests: 3,
        price_by_night: 250,
        image: 'image',
      };

      console.log('Prout', Place);

      const createStub = sinon
        .stub(Place, 'create')
        .returns(createReturnObject);

      // When
      placesController.addPlace(req, res, userSession);

      // Then
      expect(createStub.calledOnce).to.be.true;
    });
  });
  describe('#getAllPlaces', () => {
    it('should return the right object', () => {
      // Given
      const createReturnObject = [];

      console.log('Prout', Place);

      const createStub = sinon
        .stub(Place, 'findAll')
        .returns(createReturnObject);

      // When
      placesController.getAllPlaces();

      // Then
      expect(createStub.calledOnce).to.be.true;
    });
  });
});

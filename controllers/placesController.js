const models = require('../models');

module.exports = {
  addPlace: (req, res, userSession) => {
    console.log('userSession', userSession);
    console.log('req.body', req);
    const place = {
      title: req.body.title,
      description: req.body.description,
      rooms: req.body.rooms,
      bathrooms: req.body.bathrooms,
      max_guests: req.body.max_guests,
      price_by_night: req.body.price_by_night,
      image: req.body.image,
      city_id: req.body.city_id,
      host_id: userSession.id,
    };
    for (const key in place) {
      if (place[key] == null) {
        return res.status(400).json({
          error: `Le champs ${key} n'est pas renseigné ❌`,
        });
      }
    }
    models.Place.findOne({
      attributes: ['title'],
      where: { title: place.title },
    })
      .then((placeFounded) => {
        if (!placeFounded) {
          console.log('placeFounded', placeFounded);
          const newPlace = models.Place.create({
            title: req.body.title,
            description: req.body.description,
            rooms: req.body.rooms,
            bathrooms: req.body.bathrooms,
            max_guests: req.body.max_guests,
            price_by_night: req.body.price_by_night,
            image: req.body.image,
            city_id: req.body.city_id,
            host_id: userSession.id,
          }).then((newPlace) => {
            console.log('newPlace', newPlace);
            models.City.findOne({
              where: { id: req.body.city_id },
            })
              .then((cityFounded) => {
                console.log('cityFounded', cityFounded);
                return res
                  .status(201)
                  .json({
                    id: newPlace.id,
                    city: cityFounded.name,
                    title: newPlace.title,
                    description: newPlace.description,
                    rooms: newPlace.rooms,
                    bathrooms: newPlace.bathrooms,
                    max_guests: newPlace.max_guests,
                    price_by_night: newPlace.price_by_night,
                    image: newPlace.image,
                  })
                  .catch((err) => {
                    res.status(400).json({
                      error: 'Aucune ville retrouvé à cet id ❌',
                    });
                  });
              })
              .catch((err) => {
                return res.status(401).json({
                  error: "Impossible d'ajouter un(e) appartement/maison ❌",
                });
              });
          });
        } else {
          return res.status(400).json({
            error:
              "Un appartement existe déjà avec un titre d'annonce similaire ❌",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          error:
            "Il semble y avoir une erreur lors de la création de l'annonce ❌",
        });
      });
  },
  getPlaceById: (req, res) => {
    models.Place.findOne({
      attributes: [
        'id',
        'title',
        'description',
        'rooms',
        'bathrooms',
        'max_guests',
        'price_by_night',
        'image',
        'city_id',
      ],
      where: { id: req.params.id },
    })
      .then((placeFounded) => {
        models.City.findOne({
          where: { id: placeFounded.city_id },
        })
          .then((cityFounded) => {
            console.log(placeFounded);
            if (placeFounded && cityFounded) {
              return res.status(200).json({
                id: placeFounded.id,
                city: cityFounded.name,
                title: placeFounded.title,
                description: placeFounded.description,
                rooms: placeFounded.rooms,
                bathrooms: placeFounded.bathrooms,
                max_guests: placeFounded.max_guests,
                price_by_night: placeFounded.price_by_night,
                image: placeFounded.image,
              });
            }
            res.status(404).json({
              error: "Aucun appartement n'as été trouvé avec cet id ❌",
            });
          })
          .catch((err) => {
            return res.status(404).json({
              error:
                "Il semble qu'il y est une erreur dans la récupération de la ville",
            });
          });
      })
      .catch((err) => {
        res.status(400).json({
          error:
            "Il y'a eu une erreur lors de la recherche de l'appartement via l'id ❌",
        });
      });
  },
  getAllPlaces: (req, res) => {
    models.Place.findAll({
      attributes: [
        'id',
        'city_id',
        'title',
        'description',
        'rooms',
        'bathrooms',
        'max_guests',
        'price_by_night',
        'image',
      ],
      include: [
        {
          model: models.City,
          attributes: ['name'],
        },
      ],
      // raw: true,
    }).then((places) => {
      // console.log(places[0].City);
      res.status(201).json(places);
    });
  },
};

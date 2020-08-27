const express = require('express');
const authRouter = require('./authRoutes');
const citiesRouter = require('./admin/citiesRouter');
const placesRouter = require('./placeRouter');
const cors = require('cors');

const router = express.Router();

router.use(authRouter);

router.use(citiesRouter);
router.use(placesRouter);

router.get('/', cors(), (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
  });
});

// router.use('*', (req, res) => {
//   res.status(404).json({
//     error: 'Erreur 404 ❌',
//   });
// });

module.exports = router;

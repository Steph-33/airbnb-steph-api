const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');
require('express-async-errors');

const BadRequest = require('../utils/errors/bad_request');
const ServerError = require('../utils/errors/server_error');
const ConflictError = require('../utils/errors/conflict');
const NotFoundError = require('../utils/errors/not_found_error');

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

module.exports = {
  register: async (req, res) => {
    const user = {
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      avatar: req.body.avatar,
    };
    const checkEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    for (const key in user) {
      if (user[key] == null) {
        throw new BadRequest(
          'Mauvaise Requête',
          `Le champs ${key} n'est pas renseigné ❌`
        );
      }
    }
    for (const key in user) {
      if (!isString(user[key])) {
        throw new BadRequest(
          'Mauvaise Requête',
          `Le champs ${key} n'est pas une chaîne de caractères ❌`
        );
      }
    }
    if (!checkEmail.test(user.email)) {
      throw new BadRequest(
        'Mauvaise Requête',
        `Le champ email est mal renseigné ex:hello@contact.com ❌`
      );
    }
    if (user.role !== 'host' && user.role !== 'tourist') {
      throw new BadRequest(
        'Mauvaise Requête',
        'Le champ role ne peut être autre chose que <host> ou <tourist>'
      );
    }
    // TODO : check forms
    const userFound = await models.User.findOne({
      attributes: ['email'],
      where: { email: user.email },
    });
    if (!userFound) {
      bcrypt.hash(user.password, 5, async (err, bcryptedPassword) => {
        const newUser = await models.User.create({
          email: user.email,
          lastname: user.lastname,
          firstname: user.firstname,
          email: user.email,
          password: bcryptedPassword,
          role: user.role,
          avatar: user.avatar,
        });
        if (newUser) {
          return res.status(201).json({
            role: newUser.role,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
          });
        } else {
          throw new ServerError(
            'Erreur Serveur',
            "Impossible d'ajouter un utilisateur ❌"
          );
        }
      });
    } else {
      throw new ConflictError(
        'Mauvaise Requête',
        'Un utilisateur existe déjà sous le même email ❌'
      );
    }
  },
  login: async (req, res) => {
    const userinfos = {
      email: req.body.email,
      password: req.body.password,
    };
    for (const key in userinfos) {
      if (userinfos[key] == null) {
        throw new BadRequest(
          'Mauvaise Requête',
          `Le champs ${key} n'est pas renseigné ❌`
        );
      }
    }
    const userFound = await models.User.findOne({
      where: { email: userinfos.email },
    });
    if (userFound) {
      bcrypt.compare(
        userinfos.password,
        userFound.password,
        (errBycrypt, resBycrypt) => {
          const userToken = {
            role: userFound.role,
            firstname: userFound.firstname,
            lastname: userFound.lastname,
            email: userFound.email,
          };
          if (resBycrypt) {
            return res.status(200).json({
              token: jwtUtils.genereateTokenForUser(userFound),
              user: userToken,
            });
          }
          return res.status(403).json({
            error: 'Mot de passe incorrect ! ❌',
          });
        }
      );
    } else {
      throw new NotFoundError(
        'Ressource introuvable',
        "L'utilisateur demandé n'existe pas ❌"
      );
    }
  },
  getUserSession: async (req, res, cb) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth, res);
    if (userId < 0) {
      throw new BadRequest(
        'Mauvaise Requête',
        "Erreur lors de la lecture de l'id de l'utilisateur ❌"
      );
    }
    const user = await models.User.findOne({
      where: { id: userId },
    });
    if (user) {
      return cb(user.dataValues);
    }
    throw new NotFoundError(
      'Ressource introuvable',
      'Vous devez être connecté pour accéder à cette ressource ❌'
    );
  },
};

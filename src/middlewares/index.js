const jwt = require('jsonwebtoken');
const { env } = require('../config');
const { FindOne } = require('../controllers/baseController');
const { Handle500Error, Handle401Error } = require('../helpers');
const { User, Store } = require('../models');

// VerifyToken Middleware
const VerifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return Handle401Error(res);
    }

    const tokenParts = req.headers.authorization.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return Handle401Error(res);
    }

    const token = tokenParts[1];

    jwt.verify(token, env.secret, async (err, decodedUser) => {
      if (err) {
        return Handle401Error(res);
      }

      const user = await FindOne({
        model: User,
        where: { _id: decodedUser.id },
      });

      if (!user) {
        return Handle401Error(res);
      }


      req.user = user;

      next();
    });
  } catch (err) {
    return Handle500Error(res, req, err);
  }
};

exports.VerifyToken = VerifyToken;

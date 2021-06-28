const jwt = require('jsonwebtoken');
const { verifyToken } = require('../service/token.service');
const { roleRights } = require('../config/roles');

const verifyRights = (req, role, requiredRights, resolve, reject) => {
  if (!role) {
    return reject(new Error('Unauthorized'));
  }

  req.user = role;
  if (requiredRights.length) {
    const userRights = roleRights.get(role);
    const hasRequiredRights = requiredRights
      .every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights) {
      return reject(new Error('Forbidden'));
    }
  }

  resolve();
};



const auth = function (...requiredRights) {
  return function (req, res, next) {
    return new Promise((resolve, reject) => {
      const token = req.cookies['user_sess'];
      const { sub, role } = verifyToken(token);
      verifyRights(req, role, requiredRights, resolve, reject);
    })
      .then(() => next())
      .catch((err) => next(err));
  };
};


module.exports = auth;

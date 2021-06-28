const jwt = require('jsonwebtoken');
const jwt_config = require('../config/jwt_config.json');



const generateToken = (userId, expires, roles, secret = jwt_config.secret) => {
  const payload = {
    sub: userId,
    exp: expires,
    role: roles,
  };
  return jwt.sign(payload, secret);
};


const verifyToken = (token) => {
  jwt.verify(token, jwt_config.secret, (err, decoded) => {
    if (err) throw new Error('Token unautharized');
    return decoded;
  });
};



module.exports = {
  generateToken,
  verifyToken,

};

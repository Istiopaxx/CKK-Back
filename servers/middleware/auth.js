const jwt = require('jsonwebtoken');
const { roleRights } = require('../config/roles');


const auth = function (...requiredRights) {
    return function (req, res, next) {
        return new Promise((resolve, reject) => {

        })
            .then(() => next())
            .catch((err) => next(err));
    };
};




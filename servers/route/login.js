

const router = require('express').Router();
const authController = require('../controller/auth.controller');

const google = require('../oauth2/google');


router.get('/oauth2', authController.getOAuth2Urls);
router.get('/oauth2/google', authController.googleLogin);







module.exports = router;

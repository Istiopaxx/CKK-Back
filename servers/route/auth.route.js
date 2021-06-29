
const router = require('express').Router();
const authController = require('../controller/auth.controller');



router.get('/oauth2', authController.getOAuth2Urls);
router.get('/oauth2/google', authController.oAuthLogin('google'));
router.get('/oauth2/github', authController.oAuthLogin('github'));
router.get('/oauth2/kakao', authController.oAuthLogin('kakao'));







module.exports = router;

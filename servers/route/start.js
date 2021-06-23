const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const stateController = require('../controllers/stateController');




// error catch
router.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('something broke!');
});


// logging time
router.all('/', function(req, res, next) {
    console.log('Time:', Date.now());
    next();
});


// 토큰 생성
router.post('/', authController.make_token);

// 채점DB에 데이터를 생성
router.post('/', stateController.create_first_state);

// 데이터를 첨부해 반환
router.post('/', stateController.respond_state);


module.exports = router;
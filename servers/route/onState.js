const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const stateController = require('../controllers/stateController');
const actionController = require('../controllers/actionController');

router.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('something broke!');
});


router.use('/', function(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// 토큰 검증 -> 만료시 채점DB에서 데이터 삭제
router.get('/', authController.verify_token, 
    stateController.delete_state);

// 채점DB에서 데이터를 가져옴
router.get('/', stateController.get_state);
// 데이터를 첨부해 반환
router.get('/', stateController.respond_state);











module.exports = router;
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const stateController = require('../controllers/stateController');
const actionController = require('../controllers/actionController');
const gradingController = require('../controllers/gradingController');

router.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('something broke!');
});

// 토큰 검증 -> 만료시 채점DB에서 데이터 삭제
router.post('/', 
    authController.verify_token,
    stateController.delete_state
);

// 채점DB에서 데이터를 가져옴
router.post('/', stateController.get_state);

router.post('/', actionController.exec_command);

router.post('/', actionController.increase_timestamp);

router.post('/', actionController.append_tickets);

router.post('/', actionController.check_ifend);



router.post('/', 
    function(req, res, next) {
        if(req.data.gradingData.isEnd == true) {
            next();
        }
        else {
            next('route');
        }
    },
    stateController.delete_state,
    gradingController.cal_score
);

router.post('/', stateController.update_state);

router.post('/', stateController.respond_state);




module.exports = router;
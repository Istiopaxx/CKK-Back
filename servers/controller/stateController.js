

//const Problem = require('../models/problem');
//const Grading = require('../models/grading');

const gradingdb = require('../models/mongodb');


// req에 첨부된 data에서 state를 가져와서 token과 함께 respond
exports.respond_state = function (req, res) {
    const gradingData = req.data.gradingData;
    const token = req.authToken;
    const ret = {
        "token": token,
        "gradingData": gradingData,
    };
    res.status(200).json(ret);
};


// start api 호출 시 발급된 토큰으로 채점DB에 초기 state와 티켓배열을 넣음
// 성공하면 req.state 에 초기 state를 첨부
exports.create_first_state = async function(req, res, next) {
    // problem db에서 가져오는 경우

    // 랜덤 생성

    // 생성한 시나리오(json)를 채점DB에 gradingKey를 key, 시나리오를 value로 하여 저장
    // 시나리오는 firstState json객체와 사용자가 처리해야 할 ticket의 배열로 이루어진 json객체

    
    //temporary implementation
    const token = req.gradingKey;
    let data = await gradingdb.create(token);
    req.data = data;
    next();
};


// 채점DB에서 token에 해당하는 데이터를 가져와 req에 첨부
exports.get_state = async function(req, res, next) {
    // 채점DB에서 token에 해당하는 데이터를 SELECT

    // temporary implementation
    
    const token = req.gradingKey;
    try {
        let data = await gradingdb.select(token);
        req.data = data;
        next();
    }
    catch (err) {
        res.status(401).send('No data for token in DB');
    }
};


exports.update_state = async function(req, res, next) {
    // 채점DB에서 token에 해당하는 데이터를 UPDATE

    const token = req.gradingKey;
    let data = req.data;
    const ret = await gradingdb.update(token, data);
    next();
};


exports.delete_state = async function(req, res, next) {

    const token = req.gradingKey;
    // 채점DB에서 token에 해당하는 데이터를 DELETE
    const data = await gradingdb.delete(token);
    console.log("data deleted.", data);
    if(!req.decoded) {
        // 토큰 만료시 실패
        res.status(400).send('token expired');
    }
    else {
        // 토큰이 만료된게 아니면 채점이 끝난 경우
        next();
    }
    
};










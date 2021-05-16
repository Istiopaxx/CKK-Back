

exports.cal_score = function(req, res, next) {

    const gradingData = req.data.gradingData;
    const timestamp = gradingData.timestamp;
    // 채점현황DB와 score 상호작용

    
    res.status(201).send('Grading Complete. finished timestamp: ' + timestamp);

};
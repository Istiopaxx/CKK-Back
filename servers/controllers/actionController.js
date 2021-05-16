const elevator = require('../lib/elevator');

exports.exec_command = function(req, res, next) {
    const data = req.data;
    let gradingData = data.gradingData;
    const commands = req.body.commands;
    

    try {
        elevator.exec_elevator_command(gradingData, commands);
        req.data.gradingData = gradingData;
        next();
    }
    catch(err) {
        console.log('error: ' + err);
        res.status(400).send(err);
    }

};





exports.increase_timestamp = function(req, res, next) {
    let data = req.data;
    let gradingData = data.gradingData;
    let nowTimestamp = gradingData.timestamp;

    req.data.gradingData.timestamp = nowTimestamp + 1;
    next();
};





exports.append_tickets = function(req, res, next) {
    let data = req.data;
    const entire_tickets = data.entire_tickets;
    let gradingData = data.gradingData;
    let tickets = gradingData.tickets;
    let nowTimestamp = gradingData.timestamp;

    let temp = [];
    for(let i = 0; i < entire_tickets.length; i++) {
        const ticket = entire_tickets[i];
        if(ticket.timestamp == nowTimestamp) {
            tickets.push(ticket);
        }
        else {
            temp.push(ticket);
        }
    }

    req.data.gradingData.tickets = tickets;
    req.data.entire_tickets = temp;
    next();
    
};



exports.check_ifend = function(req, res, next) {
    const data = req.data;

    try {
        elevator.check_elevator_ifend(data);
        req.data = data;
        next();
    }
    catch(err) {
        console.log("Error: " + err);
        res.status(500).send(err);
    }

};









const fs = require('fs');
const parse = require('csv-parse/lib/sync');




//============================== init_elevator_data ==============================





exports.init_elevator_data = function(problemId) {
    /*
    const elevatorLimit = problemId.elevatorLimit;
    const passengerLimit = problemId.passengerLimit;
    const minFloor = problemId.minFloor;
    const maxFloor = problemId.maxFloor;
    */
    const elevatorLimit = 1;
    const passengerLimit = 8;
    const minFloor = 1;
    const maxFloor = 10;

    let firstdata = {
        "gradingData": {
            "timestamp": 0,
            "states": [],
            "tickets": [],
            "isEnd": false,
        },
        "entire_tickets": []
    };

    for (let i = 0; i < elevatorLimit; i++) {
        const id = i;
        const floor = 1;
        const passengers = [];
        const status = "STOPPED";
        const temp = {
            "elevator_id": id,
            "floor": floor,
            "passengers": passengers,
            "status": status
        };
        firstdata.gradingData.states.push(temp);
    }


    let entire_tickets_file = fs.readFileSync("./servers/p0.txt", 'utf8');
    const outputRaw = parse(entire_tickets_file);
    let output = [];

    for (let i = 0; i < outputRaw.length; i++) {
        output.push([]);
        for (let j = 0; j < outputRaw[i].length; j++) {
            let int = parseInt(outputRaw[i][j]);
            output[i].push(int);
        }
    }


    for (let i = 0; i < output.length; i++) {
        const id = output[i][1];
        const timestamp = output[i][0];
        const start = output[i][2];
        const end = output[i][3];

        const temp = {
            "id": id,
            "timestamp": timestamp,
            "start": start,
            "end": end
        };
        firstdata.entire_tickets.push(temp);
    }

    let tickets = [];
    let temp = [];
    for (let i = 0; i < firstdata.entire_tickets.length; i++) {
        const ticket = firstdata.entire_tickets[i];
        if (ticket.timestamp == 0) {
            tickets.push(ticket);
        }
        else {
            temp.push(ticket);
        }
    }

    firstdata.gradingData.tickets = tickets;
    firstdata.entire_tickets = temp;


    return firstdata;
};





//============================== execute_elevator_command ==============================
function open_elevator(gradingData, elevatorId, passengerLimit) {
    let states = gradingData.states;
    let elevator = states[elevatorId];
    let passengers = elevator.passengers;
    let tickets = gradingData.tickets;

    // UPWARD, DOWNWARD 상태에서 OPEN 명령 시 오류 발생
    if (elevator.status == "UPWARD" || elevator.status == "DOWNWARD") {
        throw new Error('Unvalid command');
    }


    // 도착지점이 현재층인 엘리베이터 탑승객이 내림
    let tempPassenger = [];
    for (let i = 0; i < passengers.length; i++) {
        if (passengers[i].end == elevator.floor) {
            continue;
        }
        else {
            tempPassenger.push(passengers[i]);
        }
    }

    // 현재 층에 있는 call이 탑승
    let tempTickets = [];
    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].start == elevator.floor && tempPassenger.length <= passengerLimit) {
            tempPassenger.push(tickets[i]);
        }
        else {
            tempTickets.push(tickets[i]);
        }
    }

    // 엘리베이터 탑승객 목록, STATUS 업데이트
    gradingData.tickets = tempTickets;
    gradingData.states[elevatorId].passengers = tempPassenger;
    gradingData.states[elevatorId].status = "OPENED";
}

function close_elevator(gradingData, elevatorId) {
    let states = gradingData.states;
    let elevator = states[elevatorId];

    // UPWARD, DOWNWARD, STOPPED 상태에서 CLOSE 명령 시 오류 발생
    if (elevator.status == "UPWARD" || elevator.status == "DOWNWARD" || elevator.status == "STOPPED") {
        throw new Error('Unvalid command');
    }

    // 엘리베이터 STATUS 업데이트
    gradingData.states[elevatorId].status = "STOPPED";
}

function stop_elevator(gradingData, elevatorId) {
    let states = gradingData.states;
    let elevator = states[elevatorId];

    // OPENED 상태에서 STOP 명령 시 오류 발생
    if (elevator.status == "OPENED") {
        throw new Error('Unvalid command');
    }

    // 엘리베이터 STATUS 업데이트
    gradingData.states[elevatorId].status = "STOPPED";
}

function up_elevator(gradingData, elevatorId, maxFloor) {
    let states = gradingData.states;
    let elevator = states[elevatorId];
    let floor = elevator.floor;

    // DOWNWARD, OPENED, 최고층 상태에서 UPWARD 명령 시 오류 발생
    if (elevator.status == "DOWNWARD" || elevator.status == "OPENED" || floor == maxFloor) {
        throw new Error('Unvalid command');
    }


    // 엘리베이터 STATUS, FLOOR 업데이트
    gradingData.states[elevatorId].status = "UPWARD";
    gradingData.states[elevatorId].floor = floor + 1;
}

function down_elevator(gradingData, elevatorId, minFloor) {
    let states = gradingData.states;
    let elevator = states[elevatorId];
    let floor = elevator.floor;

    // UPWARD, OPENED, 최저층 상태에서 DOWNWARD 명령 시 오류 발생
    if (elevator.status == "UPWARD" || elevator.status == "OPENED" || floor == minFloor) {
        throw new Error('Unvalid command');
    }

    // 엘리베이터 STATUS, FLOOR 업데이트
    gradingData.states[elevatorId].status = "DOWNWARD";
    gradingData.states[elevatorId].floor = floor - 1;
}

exports.exec_elevator_command = function (gradingData, commands) {

    if (!gradingData || !commands) {
        throw new Error('no state/commands');
    }

    // command가 엘레베이터 갯수보다 많은 경우 
    if (commands.length > 4) {
        throw new Error('too many commands');
    }

    for (var i = 0; i < commands.length; i++) {
        const elevatorId = commands[i].elevator_id;
        const command = commands[i].command;
        // passengerLimit, maxFloor, minFloor가 하드코딩되어있으니 수정
        switch (command) {
        case "OPEN":
            open_elevator(gradingData, elevatorId, 8);
            break;
        case "CLOSE":
            close_elevator(gradingData, elevatorId);
            break;
        case "STOP":
            stop_elevator(gradingData, elevatorId);
            break;
        case "UP":
            up_elevator(gradingData, elevatorId, 10);
            break;
        case "DOWN":
            down_elevator(gradingData, elevatorId, 1);
            break;
        }
    }
};



//============================== check_if_end ==============================
function is_empty_entire_tickets(entire_tickets) {
    if (entire_tickets.length == 0) {
        return true;
    }
    else
        return false;
}

function is_empty_states(states) {
    let flag = true;
    for (let i = 0; i < states.length; i++) {
        if (states[i].passengers.length != 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function is_empty_tickets(tickets) {
    if (tickets.length == 0)
        return true;
    else
        return false;
}

exports.check_elevator_ifend = function (data) {
    const entire_tickets = data.entire_tickets;
    const gradingData = data.gradingData;
    const states = gradingData.states;
    const tickets = gradingData.tickets;

    if (is_empty_entire_tickets(entire_tickets) && is_empty_states(states) && is_empty_tickets(tickets)) {
        data.gradingData.isEnd = true;
    }
};

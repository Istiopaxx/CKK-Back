
// load dependency
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const startRouter = require('./routes/start');
const onStateRouter = require('./routes/onState');
const actionRouter = require('./routes/action');
const googleLoginRouter = require('./oauth2/google');
const mongodb = require('./models/mongodb');
mongodb.connect();

// load config

const port = process.env.PORT || 4000;



// =========================================================
const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(cookieParser());



// server open
server.listen(port, () => {
    console.log(`express is running on ${port}`);
});



// api route
app.use('/api/start', startRouter);
app.use('/api/onState', onStateRouter);
app.use('/api/action', actionRouter);
app.use('/api/login', googleLoginRouter);

let data = {
    "problems": [
        {
            "id": "1",
            "name": "Elevator",
            "explanation" : "엘리베이터 제어 시스템"
        },
        {
            "id": "2",
            "name": "SNS",
            "explanation" : "팔로잉 추천을 사용자들의 팔로잉이 각각 20명 이상이 되도록 하는 추천시스템 구현"
        }
    ]
};
app.get('/api', (req, res) => res.json(data));
app.get('/', (req, res) => res.send("로그인 후 홈페이지"));




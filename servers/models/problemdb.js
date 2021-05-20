
const problemdb_config = require('../config/problemdb_config.json');

const uri = problemdb_config.uri;
const MongoClient = require('mongodb').MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
exports.MongoClient = MongoClient;
const fs = require('fs');

let data = fs.readFileSync('../../docs/API.md', 'utf-8');
console.log(data);

async function connect_doc() {
    await MongoClient.connect();
}

exports.connect = async function () {
    await MongoClient.connect();
};


exports.close = async function (req, res, next) {
    await MongoClient.close();
    next();
};


/*
let result = await MongoClient.db("gradingDB").collection("problem_id0").
    insertOne({ _id: token, gradingData, entire_tickets });
const result = await MongoClient.db("gradingDB").collection("problem_id0").
    updateOne({ _id: token }, { $set: { gradingData, entire_tickets } });


const result = await MongoClient.db("gradingDB").collection("problem_id0").
    find({ _id: token }).toArray();
return result[0];


            const result = await MongoClient.db("gradingDB").collection("problem_id0").
                find({}).toArray();


            const myQuery = { "_id": token };
            const result = await MongoClient.db("gradingDB").collection("problem_id0").
                deleteOne(myQuery);
*/

async function create_doc(data) {
    await connect_doc();

    const coll = MongoClient.db("document").collection("problem");
    let result = await coll.insertOne({ _id: "elevator", data });
    console.log(result);
    return result;
}


let ret = create_doc(data);




exports.create = async (data) => {


};

exports.update = async (id, data) => {

};

exports.find_by_problemId = async (id) => {

};

exports.delete = async (token) => {

};
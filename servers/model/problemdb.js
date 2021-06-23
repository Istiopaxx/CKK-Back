
const problemdb_config = require('../config/problemdb_config.json');

const uri = problemdb_config.uri;
const MongoClient = require('mongodb').MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let coll = null;
exports.MongoClient = MongoClient;


exports.connect = async function () {
    await MongoClient.connect();
    coll = MongoClient.db("document").collection("problem");
};


exports.close = async function () {
    await MongoClient.close();
};


exports.create = async (id, data) => {
    try {
        const result = await coll.insertOne({ _id: id, data });
        console.log(result);
        return result;
    }
    catch (err) {
        console.log(err);
        return null;
    }
};

exports.update = async (id, data) => {
    try {
        const coll = MongoClient.db("document").collection("problem");
        const result = await coll.updateOne({ _id: id }, { $set: { data } });
        console.log(result);
        return result;
    }
    catch (err) {
        console.log(err);
        return null;
    }
};

exports.find_by_problemId = async (id) => {
    try {
        const coll = MongoClient.db("document").collection("problem");
        const result = await coll.find({ _id: id }).toArray();
        console.log(result);
        return result[0];
    }
    catch (err) {
        console.log(err);
        return null;
    }
};

exports.delete = async (id) => {
    try {
        const coll = MongoClient.db("document").collection("problem");
        const result = await coll.deleteOne({ _id: id });
        console.log(result);
        return result;
    }
    catch (err) {
        console.log(err);
        return null;
    }

};









// ========================================================== testing


/*
const fs = require('fs');

let api = fs.readFileSync('./docs/API.md', 'utf-8');
let description = fs.readFileSync('./docs/ELEVATOR.md', 'utf-8');

async function connect_doc() {
    await MongoClient.connect();
}


async function ps(api, description) {
    await connect_doc();

    const coll = MongoClient.db("document").collection("problem");
    let result = await coll.insertOne({ _id: "elevator", api, description});
    // let result = await coll.find({ _id: id }).toArray();
    console.log(result);
    return result;
}


let ret = ps(api, description);

*/

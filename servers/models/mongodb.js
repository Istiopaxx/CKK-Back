
const mongodb_config = require('../config/mongodb_config.json');
const elevator = require('../lib/elevator');

const ObjectId = require('mongodb').ObjectID;
const uri = mongodb_config.uri;
const MongoClient = require('mongodb').MongoClient(uri , { useNewUrlParser: true, useUnifiedTopology: true });


exports.connect = async function() {
    await MongoClient.connect();
};


exports.close = async function (req, res, next) {
    await MongoClient.close();
    next();
};


exports.create = async(token) => {
    try{
        try {
            const data = elevator.init_elevator_data(0);
            const gradingData = data.gradingData;
            const entire_tickets = data.entire_tickets;
            let result = await MongoClient.db("gradingDB").collection("problem_id0").
                insertOne({ _id: token, gradingData, entire_tickets });

            // result = JSON.parse(result)['ops'][0];

            
            // console.log(JSON.parse(data)['ops'][0]['gradingData']);
            return data;
        } catch(err2){
            console.log("Query error!" + err2);
            return false;
        }  
    } catch(err){
        console.log("DB error!" + err);
        return false;
    }
};

exports.update = async(token,new_data) => {
    try{
        try {
            const gradingData = new_data.gradingData;
            const entire_tickets = new_data.entire_tickets;
            const result = await MongoClient.db("gradingDB").collection("problem_id0").
                updateOne({ _id: token }, { $set: { gradingData, entire_tickets } });
            return result;
        } catch(err2){
            console.log("Query error!" + err2);
            return false;
        }  
    } catch(err){
        console.log("DB error!" + err);
        return false;
    }
};

exports.select = async(token) => {
    try{
        try{
            const result = await MongoClient.db("gradingDB").collection("problem_id0").
                find({ _id: token }).toArray();
            return result[0];
        } catch(err2){
            console.log("Query error!" + err2);
            return false;
        } 
    } catch(err){
        console.log("DB error!" + err);
        return false;
    }
};

exports.selectAll = async() => {
    try{
        try{
            const result = await MongoClient.db("gradingDB").collection("problem_id0").
                find({}).toArray();
            return result;
        } catch(err2){
            console.log("Query error!" + err2);
            return false;
        } 
    } catch(err){
        console.log("DB error!" + err);
        return false;
    }
};

exports.delete = async(token) => {
    try{
        try{
            const myQuery = { "_id": token};
            const result = await MongoClient.db("gradingDB").collection("problem_id0").
                deleteOne(myQuery);
            return result.deletedCount;
        } catch(err2){
            console.log("Query error!" + err2);
            return false;
        }

    } catch(err){
        console.log("DB error!" + err);
        return false;
    }
};
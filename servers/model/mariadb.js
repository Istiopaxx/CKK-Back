const mariadb = require('mariadb');
const mariadb_config = require('../config/mariadb_config.json');

const Schema = {
    "tableName": "userInfo",
    "fields": [
        "id",
        "emailAddress",
        "password",
    ]
};




const pool = mariadb.createPool({
    host: mariadb_config.host,
    port: mariadb_config.port,
    user: mariadb_config.user,
    password: mariadb_config.password,
    database: "codekingkong",
    connectionLimit: 5
});





async function create_database(dbName) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
    finally {
        if (conn) conn.end();
    }
}


async function create_table(tableName) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(
            `CREATE TABLE IF NOT EXISTS ${tableName} ( \
                id VARCHAR(30) CHARACTER SET utf8 NOT NULL UNIQUE, \
                emailAddress VARCHAR(50) CHARACTER SET utf8 NOT NULL UNIQUE, \
                password VARCHAR(260) CHARACTER SET utf8 \
            )`
        );
    }
    catch (err) {
        console.log(err);
        throw err;
    }
    finally {
        if (conn) conn.end();
    }
}

async function delete_table(tableName) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(
            `DROP TABLE ${tableName}`
        );
    }
    catch (err) {
        console.log(err);
        throw err;
    }
    finally {
        if (conn) conn.end();
    }
}


// ======================================================================

exports.find_by_emailAddress = async function (userEmailAddress) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(
            `SELECT *\
            FROM ${Schema.tableName}\
            WHERE ${Schema.fields[1]}=?`,
            userEmailAddress
        );
        if (res.length >= 1) {
            return res[0];
        }
        else {
            return null;
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        if (conn) conn.end();
    }
};

exports.create_user = async function (data) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(
            `INSERT INTO ${Schema.tableName} \
            (id, emailAddress, password) \
            VALUES (?, ?, ?)`,
            [data.id, data.emailAddress, data.password]
        );
        return res;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        if (conn) conn.end();
    }
};

exports.update_user_password = async function(userId, newPassword) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(
            `UPDATE ${Schema.tableName}\
            SET ${Schema.fields[2]}=?\
            WHERE ${Schema.fields[0]}=?`,
            [newPassword, userId]
        );
        return res;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        if (conn) conn.end();
    }
};


exports.delete_user = async function (userId) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(
            `DELETE FROM ${Schema.tableName}\
            WHERE ${Schema.fields[0]}=?`,
            userId
        );
        return res;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        if (conn) conn.end();
    }
};



const newUser = {
    id: "test12",
    emailAddress: 'aaadfaa@gmail.com',
    password: 'abcde'
};

// let res = delete_table(Schema.tableName).then((res) => console.log(res));
// let res = create_table(Schema.tableName).then((res) => console.log(res));


async function testdb() {
    let c;
    
    // c = await create_user(newUser).then((res) => console.log(res));
    // c = await find_by_emailAddress("aaa@gmail.com").then((res) => console.log(res));
    
}

// testdb();


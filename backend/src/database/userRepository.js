const mysql = require('mysql2')
const config = require('../config')

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

let connection;

function connectionMysql(){
    connection = mysql.createConnection(dbconfig);

    connection.connect((err) => {
        if(err){
            console.log('[db error]', err);
            setTimeout(connectionMysql, 200);
        }else{
            console.log('DB conectada')
        }
    });

    connection.on('error', err => {
        console.log('[db error]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            connectionMysql();
        }else{
            throw err;
        }
    })
} 


connectionMysql();


function all(table){
    return new Promise( (resolve, reject) =>{
        connection.query(`SELECT * FROM ${table}`, (err, results) => {
            if (err) {
            return reject(err);
            }
            resolve(results);
        });
    });
}

function one(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.length === 0) {
                return resolve(null); // 🔹 Devuelve null si no se encontró el usuario
            }

            resolve(results[0]); // 🔹 Devuelve solo el primer usuario encontrado
        });
    });
}

function createUser(table, body) {
    return new Promise((resolve, reject) => {
        // Eliminar el ID si existe y la base de datos lo genera automáticamente
        if ("id" in body) {
            delete body.id;
        }

        connection.query(`INSERT INTO ${table} SET ?`, body, (err, results) => {
            if (err) {
                console.error("Error en la consulta INSERT:", err);
                return reject({ error: true, message: "Error al insertar en la base de datos", details: err });
            }

            resolve({ id: results.insertId, ...body });
        });
    });
}


function updateUser(table, body) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE id=${body.id}`, body, (err, results) => {
            if (err) {
                return reject(err);
            }

            resolve({ ...body });
        });
    });
}

function deleteUser(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${table} WHERE id=${id}`, (err, results) => {
            if (err) {
                return reject(err); 
            }

            if (results.affectedRows === 0) {
                return resolve(null); 
            }

            resolve(true); 
        });
    });
}


module.exports = {
    all,
    one,
    createUser,
    updateUser,
    deleteUser,
}
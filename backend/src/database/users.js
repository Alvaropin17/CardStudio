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
        connection.query()
    });
}

function one(table, id){

}

function add(table, data){

}

function del(table,id){

}

module.exports = {
    all,
    one,
    add,
    del,
}
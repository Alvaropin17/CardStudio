const Mysql = require('mysql2');
const Config = require('../config');
const Bcrypt = require('bcryptjs');
const User = require('./models/user'); // Importamos la clase User correctamente

const dbConfig = {
    host: Config.mysql.host,
    user: Config.mysql.user,
    password: Config.mysql.password,
    database: Config.mysql.database,
};

let connection;

function connectMysql() {
    connection = Mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('[DB error]', err);
            setTimeout(connectMysql, 200);
        } else {
            console.log('Database connected');
        }
    });

    connection.on('error', (err) => {
        console.error('[DB error]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectMysql();
        } else {
            throw err;
        }
    });
}

connectMysql();

async function getAll() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users`, (err, results) => {
            if (err) {
                return reject(err);
            }
            const users = results.map((u) => new User(u.id, u.name, u.password));
            resolve(users);
        });
    });
}

async function getOne(id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users WHERE id = ?`, [id], (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.length === 0) {
                return resolve(null);
            }

            const userData = results[0];
            const foundUser = new User(userData.id, userData.name, userData.password);
            resolve(foundUser);
        });
    });
}

async function createUser(newUser) {
    return new Promise(async (resolve, reject) => {
        try {
            newUser.password = await Bcrypt.hash(newUser.password, 10); // Hash de la contraseña

            connection.query(
                `INSERT INTO users (name, password) VALUES (?, ?)`,
                [newUser.name, newUser.password],
                (err, results) => {
                    if (err) {
                        return reject({ error: true, message: 'Error inserting into database', details: err });
                    }

                    newUser.id = results.insertId; // Asignamos el ID generado por la DB
                    resolve(newUser);
                }
            );
        } catch (error) {
            reject({ error: true, message: 'Error in user creation process', details: error });
        }
    });
}

async function updateUser(updatedUser) {
    return new Promise(async (resolve, reject) => {
        try {
            let updatedPassword = updatedUser.password;

            if (updatedUser.password) {
                updatedPassword = await Bcrypt.hash(updatedUser.password, 10);
            }

            connection.query(
                `UPDATE users SET name = ?, password = ? WHERE id = ?`,
                [updatedUser.name, updatedPassword, updatedUser.id], 
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }

                    console.log("DB update results:", results);

                    if (results.affectedRows === 0) {
                        return resolve(null);
                    }

                    resolve(updatedUser);
                }
            );
        } catch (error) {
            reject({ error: true, message: 'Error en el proceso de actualización', details: error });
        }
    });
}

function deleteUser(id) {
    console.log('Deleting user with id:', id);
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM users WHERE id = ?`, [id], (err, results) => {
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
    getAll,
    getOne,
    createUser,
    updateUser,
    deleteUser,
};

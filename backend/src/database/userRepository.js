const db = require('./db');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

//---------------------------------------------API---------------------------------------------//

async function getAll() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM users`, (err, results) => {
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
        db.query(`SELECT * FROM users WHERE id = ?`, [id], (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.length === 0) {
                return resolve(null);
            }

            const userData = results[0];
            resolve(new User(userData.id, userData.name, userData.password));
        });
    });
}

async function createUser(newUser) {
    return new Promise(async (resolve, reject) => {
        try {
            newUser.password = await bcrypt.hash(newUser.password, 10);

            db.query(
                `INSERT INTO users (name, password) VALUES (?, ?)`,
                [newUser.name, newUser.password],
                (err, results) => {
                    if (err) {
                        return reject({ error: true, message: 'Error inserting into database', details: err });
                    }

                    newUser.id = results.insertId;
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
                updatedPassword = await bcrypt.hash(updatedUser.password, 10);
            }

            db.query(
                `UPDATE users SET name = ?, password = ? WHERE id = ?`,
                [updatedUser.name, updatedPassword, updatedUser.id], 
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }

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
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM users WHERE id = ?`, [id], (err, results) => {
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

//---------------------------------------------OTHER QUERIES---------------------------------------------//

async function getByName(username) {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE name = ?',
            [username],
            (err, results) => {
                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return resolve(null);
                }

                const user = results[0];
                resolve(user);
            }
        );
    });
}


module.exports = {
    getAll,
    getOne,
    createUser,
    updateUser,
    deleteUser,
    getByName
};

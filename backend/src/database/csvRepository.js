const db = require('./db');
const CsvDataSet = require('./models/csvDataSet');

async function getAllByUser(userId) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM csv_datasets WHERE user_id = ?`, [userId], (err, results) => {
            if (err) return reject(err);
            const datasets = results.map(d =>
                new CsvDataSet(d.id, d.user_id, d.name, d.headers, d.data)
            );
            resolve(datasets);
        });
    });
}

async function getOne(id, userId) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM csv_datasets WHERE id = ? AND user_id = ?`, [id, userId], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);
            const d = results[0];
            resolve(new CsvDataSet(d.id, d.user_id, d.name, d.headers, d.data));
        });
    });
}

async function createCsvDataset(dataset) {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO csv_datasets (user_id, name, headers, data) VALUES (?, ?, ?, ?)`,
            [
                dataset.user_id,
                dataset.name,
                JSON.stringify(dataset.headers),
                JSON.stringify(dataset.data)
            ],
            (err, results) => {
                if (err) return reject(err);
                dataset.id = results.insertId;
                resolve(dataset);
            }
        );
    });
}

//TO DO: modification of dataset

async function deleteCsvDataset(id, userId) {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM csv_datasets WHERE id = ? AND user_id = ?`, [id, userId], (err, results) => {
            if (err) return reject(err);
            resolve(results.affectedRows > 0);
        });
    });
}

module.exports = {
    getAllByUser,
    getOne,
    createCsvDataset,
    deleteCsvDataset
};

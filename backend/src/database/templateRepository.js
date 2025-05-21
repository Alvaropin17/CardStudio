const db = require('./db');
const Template = require('./models/template');

async function getAllByUser(userId) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM templates WHERE user_id = ?`, [userId], (err, results) => {
            if (err) return reject(err);
            const templates = results.map(t => new Template(t.id, t.user_id, t.name, t.csv_id, t.canvas_json));
            resolve(templates);
        });
    });
}

async function getOne(id, userId) {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM templates WHERE id = ? AND user_id = ?`,
            [id, userId],
            (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                const t = results[0];
                resolve(new Template(t.id, t.user_id, t.name, t.csv_id, t.canvas_json));
            }
        );
    });
}

async function createTemplate(template) {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO templates (user_id, name, csv_id, canvas_json) VALUES (?, ?, ?, ?)`,
            [template.user_id, template.name, template.csv_id, JSON.stringify(template.canvas_json)],
            (err, results) => {
                if (err) return reject(err);
                template.id = results.insertId;
                resolve(template);
            }
        );
    });
}

async function updateTemplate(template) {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE templates SET name = ?, canvas_json = ? WHERE id = ? AND user_id = ?`,
            [template.name, JSON.stringify(template.canvas_json), template.id, template.user_id],
            (err, results) => {
                if (err) return reject(err);
                if (results.affectedRows === 0) return resolve(null);
                resolve(template);
            }
        );
    });
}

async function deleteTemplate(id, userId) {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM templates WHERE id = ? AND user_id = ?`, [id, userId], (err, results) => {
            if (err) return reject(err);
            resolve(results.affectedRows > 0);
        });
    });
}

async function assignCsvToTemplate(templateId, csvId) {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE templates SET csv_id = ? WHERE id = ?`,
            [csvId, templateId],
            (err, results) => {
                if (err) return reject(err);
                resolve(results.affectedRows > 0);
            }
        );
    });
}

module.exports = {
    getAllByUser,
    getOne,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    assignCsvToTemplate,
};

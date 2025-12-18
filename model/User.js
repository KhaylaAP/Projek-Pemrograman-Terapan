const mysql = require('mysql2');
const dbConfig = require('../config/mysql.config');

class User {
    constructor() {
        this.db = mysql.createConnection(dbConfig.db);
        this.db.connect(err => {
            if (err) throw err;
            console.log("MySQL connected (User)");
        });
    }

    all(callback) {
        const query = `
            SELECT 
                id_user,
                username,
                CREATED_AT,
                UPDATED_AT
            FROM User
        `;
        this.db.query(query, (err, results) => {
            if (err) {
                this.db.end();
                return callback(err);
            }

            const users = results.map(r => ({
                id_user: r.id_user,
                username: r.username,
                CREATED_AT: r.CREATED_AT,
                UPDATED_AT: r.UPDATED_AT
            }));

            this.db.end();
            callback(null, users);
        });
    }

    save(user, callback) {
        this.db.query('SELECT id_user FROM User WHERE username = ?', [user.username], (err, results) => {
            if (err) return callback(err);
            if (results.length > 0) return callback(new Error('Username already exists'));

            const query = `INSERT INTO User (username, password) VALUES (?, ?)`;
            const values = [user.username, user.password];

            this.db.query(query, values, (err, results) => {
            if (err) return callback(err);
            this.db.end();
            callback(null, { userId: results.insertId });
            });
        });
    }

    find(id, callback) {
        const sql = `
            SELECT 
                id_user,
                username,
                CREATED_AT,
                UPDATED_AT
            FROM User
            WHERE id_user = ?
        `;
        this.db.query(sql, [id], (err, rows) => {
            if (err) {
                this.db.end();
                return callback(err);
            }
            
            if (rows.length === 0) {
                this.db.end();
                return callback(null, null);
            }

            this.db.end();
            callback(null, rows[0]);
        });
    }

    findByUsername(username, callback) {
        const sql = `
            SELECT 
                id_user,
                username,
                password
            FROM User
            WHERE username = ?
        `;
        this.db.query(sql, [username], (err, rows) => {
            if (err) {
                this.db.end();
                return callback(err);
            }
            
            if (rows.length === 0) {
                this.db.end();
                return callback(null, null);
            }

            this.db.end();
            callback(null, rows[0]);
        });
    }

    update(id, data, callback) {
        const sql = 'UPDATE User SET username = ?, password = ? WHERE id_user = ?';
        const values = [
            data.username,
            data.password,
            id
        ];
        this.db.query(sql, values, (err, result) => {
            if (err) {
                this.db.end();
                return callback(err);
            }
            this.db.end();
            callback(null);
        });
    }

    delete(id, callback) {
        const sql = 'DELETE FROM User WHERE id_user = ?';
        this.db.query(sql, [id], (err, result) => {
            if (err) {
                this.db.end();
                return callback(err);
            }
            this.db.end();
            callback(null);
        });
    }
}

module.exports = User;
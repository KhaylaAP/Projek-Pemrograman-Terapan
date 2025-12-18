const mysql = require('mysql2');
const dbConfig = require('../config/mysql.config');

class Log {
    constructor() {
        this.db = mysql.createConnection(dbConfig.db);
        this.db.connect(err => {
            if (err) throw err;
            console.log("MySQL connected (Log)");
        });
    }

    all(callback) {
        const query = `
            SELECT 
                l.id_log, 
                l.id_user, 
                l.action, 
                l.entity, 
                l.details, 
                l.timestamp,
                u.username
            FROM UserLog l
            JOIN User u ON l.id_user = u.id_user
            ORDER BY l.timestamp DESC
        `;
        this.db.query(query, (err, results) => {
            if (err) {
                this.db.end();
                return callback(err);
            }

            const logs = results.map(r => ({
                id_log: r.id_log,
                id_user: r.id_user,
                username: r.username,
                action: r.action,
                entity: r.entity,
                details: r.details,
                timestamp: r.timestamp
            }));

            this.db.end();
            callback(null, logs);
        });
    }

    save(log, callback) {
        const query = `
            INSERT INTO UserLog (id_user, action, entity, details)
            VALUES (?, ?, ?, ?)
        `;
        const values = [log.id_user, log.action, log.entity, log.details];

        this.db.query(query, values, (err, results) => {
            if (err) {
                this.db.end();
                return callback(err);
            }

            this.db.end();
            callback(null, { logId: results.insertId });
        });
    }
}

module.exports = Log;
const mysql = require('mysql2');
const dbConfig = require('../config/mysql.config')

class Inventory {
    constructor() {
        this.db = mysql.createConnection(dbConfig.db);
        this.db.connect(err => {
            if (err) throw err;
            console.log("MySQL connected (Inventory)")
        });
    }

    all(callback) {
        const query = `
            SELECT 
                i.id_inventory, 
                i.id_produk, 
                i.tipe_jeans, 
                i.total_jmlh_ukuran, 
                i.kuantitas, 
                i.CREATED_AT, 
                i.UPDATED_AT
            FROM Inventory i
        `;
        this.db.query(query, (err, results) => {
            if (err) {
                this.db.end();
                return callback(err);
            }

            const inventory = results.map(r => ({
                id_inventory: r.id_inventory,
                id_produk: r.id_produk,
                tipe_jeans: r.tipe_jeans,
                total_jmlh_ukuran: r.total_jmlh_ukuran,
                kuantitas: r.kuantitas,
                CREATED_AT: r.CREATED_AT,
                UPDATED_AT: r.UPDATED_AT
            }));

            this.db.end();
            callback(null, inventory);
        });
    }

    save(inventory, callback) {
        const validateProduk = new Promise((resolve, reject) => {
            this.db.query('SELECT id_produk FROM Produk WHERE id_produk = ?', [inventory.id_produk], (err, results) => {
                if (err) reject(err);
                else if (results.length === 0) reject(new Error(`Produk dengan ID ${inventory.id_produk} tidak ditemukan`));
                else resolve();
            });
        });

        validateProduk
            .then(() => {
                const query = `
                    INSERT INTO Inventory (id_produk, tipe_jeans, total_jmlh_ukuran, kuantitas)
                    VALUES (?, ?, ?, ?)
                `;
                const values = [
                    inventory.id_produk,
                    inventory.tipe_jeans,
                    inventory.total_jmlh_ukuran,
                    inventory.kuantitas
                ];

                this.db.query(query, values, (err, results) => {
                    if (err) {
                        this.db.end();
                        return callback(err);
                    }

                    this.db.end();
                    callback(null, { inventoryId: results.insertId });
                });
            })
            .catch((err) => {
                this.db.end();
                return callback(err);
            });
    }

    find(id, callback) {
        const sql = `
            SELECT 
                i.*
            FROM Inventory i
            WHERE i.id_inventory = ?
        `;
        this.db.query(sql, [id], (err, rows) => {
            if (err) return callback(err);
            
            if (rows.length === 0) {
                return callback(null, null);
            }

            callback(null, rows[0]);
        });
    }

    update(id, data, callback) {
        if (data.id_produk) {
            const validateProduk = new Promise((resolve, reject) => {
                this.db.query('SELECT id_produk FROM Produk WHERE id_produk = ?', [data.id_produk], (err, results) => {
                    if (err) reject(err);
                    else if (results.length === 0) reject(new Error(`Produk dengan ID ${data.id_produk} tidak ditemukan`));
                    else resolve();
                });
            });

            validateProduk
                .then(() => {
                    this.performUpdate(id, data, callback);
                })
                .catch(callback);
        } else {
            this.performUpdate(id, data, callback);
        }
    }

    performUpdate(id, data, callback) {
        const sql = 'UPDATE Inventory SET id_produk = ?, tipe_jeans = ?, total_jmlh_ukuran = ?, kuantitas = ? WHERE id_inventory = ?';
        const values = [
            data.id_produk,
            data.tipe_jeans,
            data.total_jmlh_ukuran,
            data.kuantitas,
            id
        ];
        this.db.query(sql, values, callback);
    }

    delete(id, callback) {
        const sql = 'DELETE FROM Inventory WHERE id_inventory = ?';
        this.db.query(sql, [id], (err, result) => {
            if (err) return callback(err);
            callback(null);
        });
    }
}

module.exports = Inventory;
const mysql = require('mysql');
const dbConfig = require('../config/mysql.config')

class Produk {
    constructor() {
        this.db = mysql.createConnection(dbConfig.db);
        this.db.connect(err => {
            if (err) throw err;
            console.log("MySQL connected (Produk)")
        });
    }

    all(callback) {
        const query = `
            SELECT 
                p.id_produk, 
                p.id_kategori, 
                p.id_supplier, 
                p.kode_produk, 
                p.merk, 
                p.model, 
                p.ukuran, 
                p.harga, 
                p.jumlah_stok, 
                p.CREATED_AT, 
                p.UPDATED_AT
            FROM produk p
        `;
        this.db.query(query, (err, results) => {
            if (err) {
                this.db.end();
                return callback(err);
            }

            const produk = results.map(r => ({
                id_produk: r.id_produk,
                id_kategori: r.id_kategori,
                id_supplier: r.id_supplier,
                kode_produk: r.kode_produk,
                merk: r.merk,
                model: r.model,
                ukuran: r.ukuran,
                harga: r.harga,
                jumlah_stok: r.jumlah_stok,
                CREATED_AT: r.CREATED_AT,
                UPDATED_AT: r.UPDATED_AT
            }));

            this.db.end();
            callback(null, produk);
        });
    }

    save(produk, callback) {
        const validateKategori = new Promise((resolve, reject) => {
            this.db.query('SELECT id_kategori FROM kategori WHERE id_kategori = ?', [produk.id_kategori], (err, results) => {
                if (err) reject(err);
                else if (results.length === 0) reject(new Error(`Kategori dengan ID ${produk.id_kategori} tidak ditemukan`));
                else resolve();
            });
        });

        const validateSupplier = new Promise((resolve, reject) => {
            this.db.query('SELECT id_supplier FROM supplier WHERE id_supplier = ?', [produk.id_supplier], (err, results) => {
                if (err) reject(err);
                else if (results.length === 0) reject(new Error(`Supplier dengan ID ${produk.id_supplier} tidak ditemukan`));
                else resolve();
            });
        });

        Promise.all([validateKategori, validateSupplier])
            .then(() => {
                const query = 'INSERT INTO produk (id_kategori, id_supplier, kode_produk, merk, model, ukuran, harga, jumlah_stok) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                const values = [
                    produk.id_kategori,
                    produk.id_supplier,
                    produk.kode_produk,
                    produk.merk,
                    produk.model,
                    produk.ukuran,
                    produk.harga,
                    produk.jumlah_stok
                ];

                this.db.query(query, values, (err, results) => {
                    if (err) {
                        this.db.end();
                        return callback(err);
                    }

                    this.db.end();
                    callback(null, { produkId: results.insertId });
                });
            })
            .catch((err) => {
                this.db.end();
                return callback(err);
            });
    }

    find(id, callback) {
        const sql = 'SELECT * FROM produk WHERE id_produk = ?';
        this.db.query(sql, [id], (err, rows) => {
            if (err) return callback(err);
            
            if (rows.length === 0) {
                return callback(null, null);
            }

            callback(null, rows[0]);
        });
    }

    update(id, data, callback) {
        const validations = [];
        
        if (data.id_kategori) {
            validations.push(new Promise((resolve, reject) => {
                this.db.query('SELECT id_kategori FROM kategori WHERE id_kategori = ?', [data.id_kategori], (err, results) => {
                    if (err) reject(err);
                    else if (results.length === 0) reject(new Error(`Kategori dengan ID ${data.id_kategori} tidak ditemukan`));
                    else resolve();
                });
            }));
        }

        if (data.id_supplier) {
            validations.push(new Promise((resolve, reject) => {
                this.db.query('SELECT id_supplier FROM supplier WHERE id_supplier = ?', [data.id_supplier], (err, results) => {
                    if (err) reject(err);
                    else if (results.length === 0) reject(new Error(`Supplier dengan ID ${data.id_supplier} tidak ditemukan`));
                    else resolve();
                });
            }));
        }

        Promise.all(validations)
            .then(() => {
                const sql = 'UPDATE produk SET id_kategori = ?, id_supplier = ?, kode_produk = ?, merk = ?, model = ?, ukuran = ?, harga = ?, jumlah_stok = ? WHERE id_produk = ?';
                const values = [
                    data.id_kategori,
                    data.id_supplier,
                    data.kode_produk,
                    data.merk,
                    data.model,
                    data.ukuran,
                    data.harga,
                    data.jumlah_stok,
                    id
                ];
                this.db.query(sql, values, callback);
            })
            .catch(callback);
    }

    delete(id, callback) {
        const sql = 'DELETE FROM produk WHERE id_produk = ?';
        this.db.query(sql, [id], (err, result) => {
            if (err) return callback(err);
            callback(null);
        });
    }
}

module.exports = Produk;
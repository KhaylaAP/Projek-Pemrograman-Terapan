const mysql = require('mysql');
const dbConfig = require('../config/mysql.config')

class Kategori {
    constructor() {
        this.db = mysql.createConnection(dbConfig.db);
        this.db.connect(err => {
            if (err) throw err;
            console.log("MySQL connected (Kategori)")
        });
    }

     all (callback) {
    const query = `
      SELECT id_kategori, nama_kategori, deskripsi, CREATED_AT, UPDATED_AT
      FROM kategori
    `;
    this.db.query(query, (err, results) => {
      if (err) {
        this.db.end();
        return callback(err);
      }

      const kategori = results.map(r => ({
        id_kategori     : r.id_kategori,
        nama_kategori   : r.nama_kategori,
        deskripsi       : r.deskripsi,
        CREATED_AT      : r.CREATED_AT,
        UPDATED_AT      : r.UPDATED_AT,
      }));

      this.db.end();
      callback(null, kategori);
    });
  }


  save (kategori, callback) {
    const query = `
      INSERT INTO kategori (nama_kategori, deskripsi)
      VALUES (?, ?)
    `;
    const values = [
      kategori.nama_kategori,
      kategori.deskripsi
    ];

    this.db.query(query, values, (err, results) => {
      if (err) {
        this.db.end();
        return callback(err);
      }

      this.db.end();
      callback(null, { kategoriId: results.insertId });
    });
  }

  find(id, callback) {
    const sql = 'SELECT * FROM kategori WHERE id_kategori = ?';
    this.db.query(sql, [id], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0]);
    });
  }

  update(id, data, callback) {
    const sql = 'UPDATE kategori SET nama_kategori = ?, deskripsi = ? WHERE id_kategori = ?';
    const values = [data.nama_kategori, data.deskripsi];
    this.db.query(sql, values, callback);
  }
  delete(id, callback) {
    const sql = 'DELETE FROM kategori WHERE id_kategori = ?';
    this.db.query(sql, [id], (err, result) => {
      if (err) return callback(err);
      callback(null);
    });
  }

}

module.exports = Kategori;

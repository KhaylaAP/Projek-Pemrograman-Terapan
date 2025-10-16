const mysql = require('mysql');
const dbConfig = require('../config/mysql.config')

class Supplier {
    constructor() {
        this.db = mysql.createConnection(dbConfig.db);
        this.db.connect(err => {
            if (err) throw err;
            console.log("MySQL connected (Supplier)")
        });
    }

     all (callback) {
    const query = `
      SELECT id_supplier, nama_supplier, email, no_telp, notes, CREATED_AT, UPDATED_AT
      FROM supplier
    `;
    this.db.query(query, (err, results) => {
      if (err) {
        this.db.end();
        return callback(err);
      }

      const supplier = results.map(r => ({
        id_supplier     : r.id_supplier,
        nama_supplier   : r.nama_supplier,
        email           : r.email,
        no_telp         : r.no_telp,
        notes           : r.notes,
        CREATED_AT      : r.CREATED_AT,
        UPDATED_AT      : r.UPDATED_AT,
      }));

      this.db.end();
      callback(null, supplier);
    });
  }


  save (supplier, callback) {
    const query = `
      INSERT INTO supplier (nama_supplier, email, no_telp, notes)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      supplier.nama_supplier,
      supplier.deskripsi,
      supplier.email,
      supplier.no_telp,
      supplier.notes
    ];

    this.db.query(query, values, (err, results) => {
      if (err) {
        this.db.end();
        return callback(err);
      }

      this.db.end();
      callback(null, { supplierId: results.insertId });
    });
  }

  find(id, callback) {
    const sql = 'SELECT * FROM supplier WHERE id_supplier = ?';
    this.db.query(sql, [id], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0]);
    });
  }

  update(id, data, callback) {
    const sql = 'UPDATE supplier SET nama_supplier = ?, deskripsi = ?, email = ?, no_telp = ?, notes = ? WHERE id_supplier = ?';
    const values = [data.nama_supplier, data.deskripsi, data.email, data.no_telp, data.notes];
    this.db.query(sql, values, callback);
  }
  delete(id, callback) {
    const sql = 'DELETE FROM supplier WHERE id_supplier = ?';
    this.db.query(sql, [id], (err, result) => {
      if (err) return callback(err);
      callback(null);
    });
  }

}

module.exports = Supplier;

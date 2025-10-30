const Inventory = require('../models/Inventory');

// Controller Inventory
const inventoryController = {

  // Menampilkan semua data inventory
  index: (req, res) => {
    const model = new Inventory();
    model.all((err, data) => {
      if (err) {
        console.error('Error mengambil data inventory:', err);
        return res.status(500).send('Gagal mengambil data inventory');
      }
      res.render('inventory/index', { inventory: data });
    });
  },

  // ➕ Form tambah data inventory
  create: (req, res) => {
    res.render('inventory/create');
  },

  // Simpan data inventory baru
  store: (req, res) => {
    const newInventory = {
      id_produk: req.body.id_produk,
      tipe_jeans: req.body.tipe_jeans,
      total_jmlh_ukuran: req.body.total_jmlh_ukuran,
      kuantitas: req.body.kuantitas
    };

    const model = new Inventory();
    model.save(newInventory, (err) => {
      if (err) {
        console.error('Error menyimpan inventory:', err.message);
        return res.status(500).send(`Gagal menambah inventory: ${err.message}`);
      }
      res.redirect('/inventory');
    });
  },

  // Menampilkan form edit inventory berdasarkan ID
  edit: (req, res) => {
    const id = req.params.id;
    const model = new Inventory();
    model.find(id, (err, inventory) => {
      if (err) {
        console.error('Error mencari inventory:', err);
        return res.status(500).send('Gagal mengambil data inventory');
      }
      if (!inventory) {
        return res.status(404).send('Inventory tidak ditemukan');
      }
      res.render('inventory/edit', { inventory });
    });
  },

  // Update data inventory berdasarkan ID
  update: (req, res) => {
    const id = req.params.id;
    const updatedData = {
      id_produk: req.body.id_produk,
      tipe_jeans: req.body.tipe_jeans,
      total_jmlh_ukuran: req.body.total_jmlh_ukuran,
      kuantitas: req.body.kuantitas
    };

    const model = new Inventory();
    model.update(id, updatedData, (err) => {
      if (err) {
        console.error('Error memperbarui inventory:', err.message);
        return res.status(500).send(`Gagal memperbarui inventory: ${err.message}`);
      }
      res.redirect('/inventory');
    });
  },

  // Hapus data inventory berdasarkan ID
  destroy: (req, res) => {
    const id = req.params.id;
    const model = new Inventory();
    model.delete(id, (err) => {
      if (err) {
        console.error('Error menghapus inventory:', err);
        return res.status(500).send('Gagal menghapus inventory');
      }
      res.redirect('/inventory');
    });
  }

};

module.exports = inventoryController;

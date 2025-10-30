const Inventory = require('../model/Inventory');

const inventoryController = {
  index: (req, res) => {
    const model = new Inventory();
    model.all((err, data) => {
      if (err) {
        console.error('Error mengambil data inventory:', err);
        return res.status(500).send('Gagal mengambil data inventory');
      }
      res.render('inventory/index', { 
        inventory: data,
        title: 'Inventory Management'
      });
    });
  },

  create: (req, res) => {
    res.render('inventory/create', { title: 'Add Inventory' });
  },

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
      res.render('inventory/edit', { 
        inventory,
        title: 'Edit Inventory'
      });
    });
  },

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
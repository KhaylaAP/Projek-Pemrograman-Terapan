// controllers/supplierController.js
const Supplier = require('../model/Supplier');

const supplierController = {
  // [GET] /supplier
  index: (req, res) => {
    const supplier = new Supplier();
    supplier.all((err, data) => {
      if (err) {
        console.error('Error fetching supplier:', err);
        return res.status(500).send('Terjadi kesalahan saat mengambil data supplier.');
      }
      res.render('supplier/index', { title: 'Daftar Supplier', supplier: data });
    });
  },

  // [GET] /supplier/create
  create: (req, res) => {
    res.render('supplier/create', { title: 'Tambah Supplier' });
  },

  // [POST] /supplier/create
  store: (req, res) => {
    const supplier = new Supplier();
    const newSupplier = {
      nama_supplier: req.body.nama_supplier,
      email: req.body.email,
      no_telp: req.body.no_telp,
      notes: req.body.notes
    };

    supplier.save(newSupplier, (err, result) => {
      if (err) {
        console.error('Error saving supplier:', err);
        return res.status(500).send('Gagal menyimpan supplier.');
      }
      res.redirect('/supplier');
    });
  },

  // [GET] /supplier/edit/:id
  edit: (req, res) => {
    const supplier = new Supplier();
    supplier.find(req.params.id, (err, data) => {
      if (err) {
        console.error('Error fetching supplier:', err);
        return res.status(500).send('Terjadi kesalahan saat mengambil data supplier.');
      }
      if (!data) return res.status(404).send('Supplier tidak ditemukan.');

      res.render('supplier/edit', { title: 'Edit Supplier', supplier: data });
    });
  },

  // [POST] /supplier/update/:id
  update: (req, res) => {
    const supplier = new Supplier();
    const updateData = {
      nama_supplier: req.body.nama_supplier,
      email: req.body.email,
      no_telp: req.body.no_telp,
      notes: req.body.notes
    };

    supplier.update(req.params.id, updateData, (err) => {
      if (err) {
        console.error('Error updating supplier:', err);
        return res.status(500).send('Gagal memperbarui supplier.');
      }
      res.redirect('/supplier');
    });
  },

  // [GET] /supplier/delete/:id
  destroy: (req, res) => {
    const supplier = new Supplier();
    supplier.delete(req.params.id, (err) => {
      if (err) {
        console.error('Error deleting supplier:', err);
        return res.status(500).send('Gagal menghapus supplier.');
      }
      res.redirect('/supplier');
    });
  }
};

module.exports = supplierController;

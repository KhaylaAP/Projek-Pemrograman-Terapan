// controllers/produkController.js
const Produk = require('../models/Produk');
const Kategori = require('../models/Kategori');
const Supplier = require('../models/Supplier');

const produkController = {
  // [GET] /produk
  index: (req, res) => {
    const produk = new Produk();
    produk.all((err, data) => {
      if (err) {
        console.error('Error fetching produk:', err);
        return res.status(500).send('Terjadi kesalahan saat mengambil data produk.');
      }
      res.render('produk/index', { title: 'Daftar Produk', produk: data });
    });
  },

  // [GET] /produk/create
  create: (req, res) => {
    const kategori = new Kategori();
    const supplier = new Supplier();

    // ambil semua kategori dan supplier untuk dropdown
    kategori.all((err, kategoriData) => {
      if (err) return res.status(500).send('Gagal mengambil kategori.');

      supplier.all((err, supplierData) => {
        if (err) return res.status(500).send('Gagal mengambil supplier.');

        res.render('produk/create', {
          title: 'Tambah Produk',
          kategori: kategoriData,
          supplier: supplierData
        });
      });
    });
  },

  // [POST] /produk/create
  store: (req, res) => {
    const produk = new Produk();
    const newProduk = {
      id_kategori: req.body.id_kategori,
      id_supplier: req.body.id_supplier,
      kode_produk: req.body.kode_produk,
      merk: req.body.merk,
      model: req.body.model,
      ukuran: req.body.ukuran,
      harga: req.body.harga,
      jumlah_stok: req.body.jumlah_stok
    };

    produk.save(newProduk, (err, result) => {
      if (err) {
        console.error('Error saving produk:', err.message);
        return res.status(500).send(err.message);
      }
      res.redirect('/produk');
    });
  },

  // [GET] /produk/edit/:id
  edit: (req, res) => {
    const produk = new Produk();
    const kategori = new Kategori();
    const supplier = new Supplier();

    produk.find(req.params.id, (err, data) => {
      if (err) return res.status(500).send('Gagal mengambil data produk.');
      if (!data) return res.status(404).send('Produk tidak ditemukan.');

      kategori.all((err, kategoriData) => {
        if (err) return res.status(500).send('Gagal mengambil kategori.');

        supplier.all((err, supplierData) => {
          if (err) return res.status(500).send('Gagal mengambil supplier.');

          res.render('produk/edit', {
            title: 'Edit Produk',
            produk: data,
            kategori: kategoriData,
            supplier: supplierData
          });
        });
      });
    });
  },

  // [POST] /produk/update/:id
  update: (req, res) => {
    const produk = new Produk();
    const updateData = {
      id_kategori: req.body.id_kategori,
      id_supplier: req.body.id_supplier,
      kode_produk: req.body.kode_produk,
      merk: req.body.merk,
      model: req.body.model,
      ukuran: req.body.ukuran,
      harga: req.body.harga,
      jumlah_stok: req.body.jumlah_stok
    };

    produk.update(req.params.id, updateData, (err) => {
      if (err) {
        console.error('Error updating produk:', err.message);
        return res.status(500).send(err.message);
      }
      res.redirect('/produk');
    });
  },

  // [GET] /produk/delete/:id
  destroy: (req, res) => {
    const produk = new Produk();
    produk.delete(req.params.id, (err) => {
      if (err) {
        console.error('Error deleting produk:', err);
        return res.status(500).send('Gagal menghapus produk.');
      }
      res.redirect('/produk');
    });
  }
};

module.exports = produkController;

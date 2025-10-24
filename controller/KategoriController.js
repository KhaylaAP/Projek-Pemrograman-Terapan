const Kategori = require('../models/Kategori');
const kategoriModel = new Kategori();

const kategoriController = {

  index: (req, res) => {
    const model = new Kategori();
    model.all((err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Gagal mengambil data kategori');
      }
      res.render('kategori/index', { kategori: data });
    });
  },

  create: (req, res) => {
    res.render('kategori/create');
  },

  store: (req, res) => {
    const newKategori = {
      nama_kategori: req.body.nama_kategori,
      deskripsi: req.body.deskripsi,
    };

    const model = new Kategori();
    model.save(newKategori, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Gagal menambah kategori');
      }
      res.redirect('/kategori');
    });
  },

  edit: (req, res) => {
    const id = req.params.id;
    const model = new Kategori();
    model.find(id, (err, kategori) => {
      if (err) return res.status(500).send('Gagal mengambil data kategori');
      if (!kategori) return res.status(404).send('Kategori tidak ditemukan');
      res.render('kategori/edit', { kategori });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = {
      nama_kategori: req.body.nama_kategori,
      deskripsi: req.body.deskripsi,
    };

    const model = new Kategori();
    model.update(id, data, (err) => {
      if (err) return res.status(500).send('Gagal memperbarui kategori');
      res.redirect('/kategori');
    });
  },

  destroy: (req, res) => {
    const id = req.params.id;
    const model = new Kategori();
    model.delete(id, (err) => {
      if (err) return res.status(500).send('Gagal menghapus kategori');
      res.redirect('/kategori');
    });
  },
};

module.exports = kategoriController;

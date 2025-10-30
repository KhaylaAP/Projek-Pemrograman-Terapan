// routes/route.js
const express = require('express');
const path = require('path');
const router = express.Router();

// import controller
const produkController = require('../controllers/produkController');
const supplierController = require('../controllers/supplierController');
const kategoriController = require('../controllers/kategoriController');
const inventoryController = require('../controllers/inventoryController');

// folder public untuk file statis (gambar, css, js frontend)
router.use(express.static('public'));

// ====== ROUTE PRODUK ======
router.get('/produk', produkController.index);
router.get('/produk/create', produkController.create);
router.post('/produk/create', produkController.store);
router.get('/produk/edit/:id', produkController.edit);
router.post('/produk/update/:id', produkController.update);
router.get('/produk/delete/:id', produkController.destroy);

// ====== ROUTE SUPPLIER ======
router.get('/supplier', supplierController.index);
router.get('/supplier/create', supplierController.create);
router.post('/supplier/create', supplierController.store);
router.get('/supplier/edit/:id', supplierController.edit);
router.post('/supplier/update/:id', supplierController.update);
router.get('/supplier/delete/:id', supplierController.destroy);

// ====== ROUTE KATEGORI ======
router.get('/kategori', kategoriController.index);
router.get('/kategori/create', kategoriController.create);
router.post('/kategori/create', kategoriController.store);
router.get('/kategori/edit/:id', kategoriController.edit);
router.post('/kategori/update/:id', kategoriController.update);
router.get('/kategori/delete/:id', kategoriController.destroy);

// ====== ROUTE INVENTORY ======
router.get('/inventory', inventoryController.index);
router.get('/inventory/create', inventoryController.create);
router.post('/inventory/create', inventoryController.store);
router.get('/inventory/edit/:id', inventoryController.edit);
router.post('/inventory/update/:id', inventoryController.update);
router.get('/inventory/delete/:id', inventoryController.destroy);

// ====== ROUTE DASHBOARD ======
router.get('/', (req, res) => {
  res.render('dashboard'); // nanti arahkan ke file dashboard.ejs atau html
});

module.exports = router;


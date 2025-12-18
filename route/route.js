const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../controller/UserController');
const produkController = require('../controller/ProdukController');
const supplierController = require('../controller/SupplierController');
const kategoriController = require('../controller/KategoriController');
const inventoryController = require('../controller/InventoryController');

// Static files
router.use(express.static('public'));

// ====== USER ROUTES ======
router.get('/user', userController.requireLogin, userController.index);
router.get('/user/create', userController.requireLogin, userController.create);
router.post('/user/create', userController.requireLogin, userController.store);
router.get('/user/edit/:id', userController.requireLogin, userController.edit);
router.post('/user/update/:id', userController.requireLogin, userController.update);
router.get('/user/delete/:id', userController.requireLogin, userController.destroy);

// ====== PRODUCT ROUTES ======
router.get('/produk', userController.requireLogin, produkController.index);
router.get('/produk/create', userController.requireLogin, produkController.create);
router.post('/produk/create', userController.requireLogin, produkController.store);
router.get('/produk/edit/:id', userController.requireLogin, produkController.edit);
router.post('/produk/update/:id', userController.requireLogin, produkController.update);
router.get('/produk/delete/:id', userController.requireLogin, produkController.destroy);

// ====== SUPPLIER ROUTES ======
router.get('/supplier', userController.requireLogin, supplierController.index);
router.get('/supplier/create', userController.requireLogin, supplierController.create);
router.post('/supplier/create', userController.requireLogin, supplierController.store);
router.get('/supplier/edit/:id', userController.requireLogin, supplierController.edit);
router.post('/supplier/update/:id', userController.requireLogin, supplierController.update);
router.get('/supplier/delete/:id', userController.requireLogin, supplierController.destroy);

// ====== CATEGORY ROUTES ======
router.get('/kategori', userController.requireLogin, kategoriController.index);
router.get('/kategori/create', userController.requireLogin, kategoriController.create);
router.post('/kategori/create', userController.requireLogin, kategoriController.store);
router.get('/kategori/edit/:id', userController.requireLogin, kategoriController.edit);
router.post('/kategori/update/:id', userController.requireLogin, kategoriController.update);
router.get('/kategori/delete/:id', userController.requireLogin, kategoriController.destroy);

// ====== INVENTORY ROUTES ======
router.get('/inventory', userController.requireLogin, inventoryController.index);
router.get('/inventory/create', userController.requireLogin, inventoryController.create);
router.post('/inventory/create', userController.requireLogin, inventoryController.store);
router.get('/inventory/edit/:id', userController.requireLogin, inventoryController.edit);
router.post('/inventory/update/:id', userController.requireLogin, inventoryController.update);
router.get('/inventory/delete/:id', userController.requireLogin, inventoryController.destroy);

// ====== DASHBOARD ======
router.get('/dashboard', userController.showDashboard);

// ====== PUBLIC ROUTES ======
router.get('/', userController.showLogin);
router.get('/login', userController.showLogin);
router.post('/login', userController.login);
router.get('/register', userController.showRegister);
router.post('/register', userController.register);
router.get('/logout', userController.logout);

module.exports = router;
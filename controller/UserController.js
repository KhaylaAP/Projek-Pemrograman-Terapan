const User = require('../model/User');

const userController = {
  index: (req, res) => {
    const model = new User();
    model.all((err, data) => {
      if (err) {
        console.error('Error mengambil data user:', err);
        return res.status(500).send('Gagal mengambil data user');
      }
      res.render('user/index', { 
        users: data,
        title: 'User Management'
      });
    });
  },

  create: (req, res) => {
    res.render('user/create', { title: 'Add User' });
  },

  store: (req, res) => {
    const newUser = {
      username: req.body.username,
      password: req.body.password
    };

    const model = new User();
    model.save(newUser, (err) => {
      if (err) {
        console.error('Error menyimpan user:', err.message);
        return res.status(500).send(`Gagal menambah user: ${err.message}`);
      }
      res.redirect('/user');
    });
  },

  edit: (req, res) => {
    const id = req.params.id;
    const model = new User();
    model.find(id, (err, user) => {
      if (err) {
        console.error('Error mencari user:', err);
        return res.status(500).send('Gagal mengambil data user');
      }
      if (!user) {
        return res.status(404).send('User tidak ditemukan');
      }
      res.render('user/edit', { 
        user,
        title: 'Edit User'
      });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const updatedData = {
      username: req.body.username,
      password: req.body.password
    };

    const model = new User();
    model.update(id, updatedData, (err) => {
      if (err) {
        console.error('Error memperbarui user:', err.message);
        return res.status(500).send(`Gagal memperbarui user: ${err.message}`);
      }
      res.redirect('/user');
    });
  },

  destroy: (req, res) => {
    const id = req.params.id;
    const model = new User();
    model.delete(id, (err) => {
      if (err) {
        console.error('Error menghapus user:', err);
        return res.status(500).send('Gagal menghapus user');
      }
      res.redirect('/user');
    });
  },

  showLogin: (req, res) => {
    res.render('user/login', { title: 'Login' });
  },

  login: (req, res) => {
    const { username, password } = req.body;
    const model = new User();

    model.findByUsername(username, (err, user) => {
      if (err) {
        console.error('Error login:', err);
        return res.status(500).send('Gagal proses login');
      }
      if (!user) {
        return res.status(401).send('Username tidak ditemukan');
      }
      if (user.password !== password) {
        return res.status(401).send('Password salah');
      }

      req.session.userId = user.id_user;
      req.session.username = user.username;
      
      res.redirect('/dashboard');
    });
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  }
};

module.exports = userController;
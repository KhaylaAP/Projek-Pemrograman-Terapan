const User = require('../model/User');
const loggedInUsers = {};

const userController = {
  index: (req, res) => {
    if (!req.cookies.userId) {
      return res.redirect('/');
    }
    
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
    if (!req.cookies.userId) {
      return res.redirect('/');
    }
    
    res.render('user/create', { title: 'Add User' });
  },

  store: (req, res) => {
    if (!req.cookies.userId) {
      return res.redirect('/');
    }
    
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
    if (!req.cookies.userId) {
      return res.redirect('/');
    }
    
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
    if (!req.cookies.userId) {
      return res.redirect('/');
    }
    
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
    if (!req.cookies.userId) {
      return res.redirect('/');
    }
    
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
    if (req.cookies.userId && loggedInUsers[req.cookies.userId]) {
      return res.redirect('/dashboard');
    }
    
    const error = req.query.error || null;
    res.render('loginPage', { 
      title: 'Login',
      error: error
    });
  },

  login: (req, res) => {
    const { username, password } = req.body;
    const model = new User();

    console.log('Login attempt for user:', username);

    model.findByUsername(username, (err, user) => {
      if (err) {
        console.error('Database error during login:', err);
        return res.redirect('/?error=System+error.+Please+try+again.');
      }
      
      if (!user) {
        console.log('User not found:', username);
        return res.redirect('/?error=Invalid+username+or+password');
      }
      
      if (user.password !== password) {
        console.log('Incorrect password for user:', username);
        return res.redirect('/?error=Invalid+username+or+password');
      }
      
      console.log('Login successful for:', username);
      
      loggedInUsers[user.id_user] = {
        id: user.id_user,
        username: user.username,
        loginTime: new Date()
      };
      
      res.cookie('userId', user.id_user, { maxAge: 24 * 60 * 60 * 1000 });
      res.cookie('username', user.username, { maxAge: 24 * 60 * 60 * 1000 });
      
      res.redirect('/dashboard');
    });
  },

  logout: (req, res) => {
    if (req.cookies.userId) {
      delete loggedInUsers[req.cookies.userId];
    }
    
    res.clearCookie('userId');
    res.clearCookie('username');
    
    res.redirect('/');
  },

  showDashboard: (req, res) => {
    const userId = req.cookies.userId;
    
    if (!userId || !loggedInUsers[userId]) {
      return res.redirect('/?error=Please+login+first');
    }
    
    res.render('dashboard', {
      title: 'Dashboard',
      username: req.cookies.username || 'User'
    });
  },
  
  requireLogin: (req, res, next) => {
    const userId = req.cookies.userId;
    
    if (!userId || !loggedInUsers[userId]) {
      console.log('User not logged in, redirecting to login');
      return res.redirect('/?error=Please+login+first');
    }
    
    next();
  }
};

module.exports = userController;
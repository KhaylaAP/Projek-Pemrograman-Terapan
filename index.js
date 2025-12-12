const express = require('express');
const app = express();
const path = require('path');
const routes = require('./route/route');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'pages'));

app.use((req, res, next) => {
  req.cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      req.cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
  }
  next();
});

app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
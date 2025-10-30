const express = require('express');
const app = express();
const path = require('path');
const routes = require('./route/route');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', './pages');

app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

app.use(express.urlencoded({ extended: false }));

app.use(routes); 

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
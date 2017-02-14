const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const router = require('./routes/index');
app.set('views',  path.join(__dirname, 'views'));   
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));//设置静态目录
app.use(router);
app.listen(3000);
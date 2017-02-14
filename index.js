const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const router = require('./routes/index');
app.set('views',  path.join(__dirname, 'views'));   
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));//设置静态目录
app.use(cookieParser());
app.use(router);
app.listen(3000);
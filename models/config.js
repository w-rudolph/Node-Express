const mysql = require('mysql');
const config = {
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test',
  port     : 3306
};
const db = mysql.createConnection(config);
db.connect();
module.exports = db;
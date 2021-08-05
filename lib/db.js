// for git push
var mysql = require('mysql');
var db = mysql.createConnection({
  host: '192.168.71.254',
  user: 'dbuser',
  port: '3307',
  password: 'Mariadb-00',
  database: 'web_db'
});
db.connect();
module.exports = db;
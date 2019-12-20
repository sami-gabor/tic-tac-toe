const mysql = require('mysql');

module.exports = mysql.createConnection({
  host: '46.101.171.162',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'tictactoe_db',
});

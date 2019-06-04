const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3307',
  user: 'root',
  password: 'root',
  database: 'github-users',
});

connection.connect();

connection.query('SELECT * FROM users WHERE username = ?', ['s-gabor'], (error, results, fields) => {
  if (error) {
    console.log(error);
  }
  console.log('The solution is: ', results[0].score);
});

connection.end();

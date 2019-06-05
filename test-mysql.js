const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3307',
  user: 'root',
  password: 'root',
  database: 'tic',
});

connection.connect();

connection.query('SELECT * FROM users', (error, results, fields) => {
  if (error) {
    console.log(error);
  }
  console.log('The solution is: ', results);
});

connection.end();


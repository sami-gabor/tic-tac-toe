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
  console.log('The users are: ', results);
});

connection.query('SELECT * FROM tokens', (error, results, fields) => {
  if (error) {
    console.log(error);
  }
  console.log('The tokens are: ', results);
});

// const hash = 'UvVQeCmHJOzYgxPhitmq.xQTRrC3ifQAlh0';
// const email = 'testtoken2@gmail.com';
// connection.query(`INSERT INTO tokens (hash, user_id) VALUES ("${hash}", (SELECT id FROM users WHERE email = "${email}"))`, (error) => {
//   if (error) throw error;
// });


connection.end();



// function async main() {
//   await db.connect()
// }
// main().then();


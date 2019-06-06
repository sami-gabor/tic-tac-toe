const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3307',
  user: 'root',
  password: 'root',
  database: 'tic',
});

connection.connect();


// connection.query('SELECT * FROM users', (error, results, fields) => {
//   if (error) {
//     console.log(error);
//   }
//   console.log('The users solution is: ', results);
// });


connection.query('SELECT * FROM tokens', (error, results, fields) => {
  if (error) {
    console.log(error);
  }
  console.log('The tokens solution is: ', results);
});


// connection.query('INSERT INTO tokens (hash, user_id) VALUES ("pass", (SELECT id FROM users WHERE email = "testtoken3@gmail.com"))', (error) => {
//   if (error) throw error;
// });


connection.end();



// function async main() {
//   await db.connect()
// }
// main().then();


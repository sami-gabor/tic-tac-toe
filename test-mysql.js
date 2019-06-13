const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3307',
  user: 'root',
  password: 'root',
  database: 'tic',
});


const updateScore = (score, id) => {
  // const query = `UPDATE users SET score = ${score} WHERE `;
  // return connection.query(query, cb);
  connection.query(`UPDATE users SET score = ${score} WHERE id = ${id}`, (error) => {
    if (error) throw error;
  });
};


// connection.connect();


// connection.query('SELECT * FROM users', (error, results, fields) => {
//   if (error) {
//     console.log(error);
//   }
//   console.log('The users are: ', results);
// });

// connection.query('SELECT * FROM tokens WHERE id="7"', (error, results, fields) => {
//   if (error) {
//     console.log(error);
//   }
//   console.log('The tokens are: ', results);
// });

const token = '6ef668c168befd2592813745a8d0adcb82f1f2ed86c3a3952d5184cc05039b4bf37eabdaec279239e9feb15879375ee831cbcd96955ce6c3979de063f1504e840365cbed87100afca1275f4642314134856d098230560b97f24ffccf9c4431a06ec0ce21716f056149f0c9bb25995e21c4a5dd80882d7c7b5388780b012ae718';
connection.query(`SELECT * FROM users JOIN tokens ON users.id = (SELECT user_id FROM tokens WHERE token = "${token}") ORDER BY tokens.id DESC LIMIT 1`, (error, results, fields) => {
  if (error) {
    console.log(error);
  }
  console.log('The tokens are: ', results);
});


// // const hash = 'UvVQeCmHJOzYgxPhitmq.xQTRrC3ifQAlh0';
// // const email = 'testtoken2@gmail.com';
// // connection.query(`INSERT INTO tokens (hash, user_id) VALUES ("${hash}", (SELECT id FROM users WHERE email = "${email}"))`, (error) => {
// //   if (error) throw error;
// // });


// connection.end();



// function async main() {
//   await db.connect()
// }
// main().then();


// const myFunction = async () => {
//   const result = await connection.query('SELECT email FROM users');
//   return result;
// };

// myFunction().then((result) => {
//   // handle result
//   console.log(result);
// });


// const myFunction = cb => connection.query('SELECT * FROM users WHERE username = "sam"', cb);
// myFunction((err, res) => {
//   console.log('ERROR/RES HERE: ', res[0].password);
// });

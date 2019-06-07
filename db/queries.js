const connection = require('./connection.js');


const storeUserData = (username, password, email) => {
  const results = [
    [username, password, email],
  ];

  connection.connect();

  // id, username, email, password, score, joined
  connection.query('INSERT INTO users (username, password, email) VALUES ?', [results], (error) => {
    if (error) throw error;
  });

  connection.end();
};


const storeTokenData = (token, email) => {
  connection.connect();

  // id, token, user_id
  connection.query(`INSERT INTO tokens (token, user_id) VALUES ("${token}", (SELECT id FROM users WHERE email = "${email}"))`, (error) => {
    if (error) throw error;
  });

  connection.end();
};


const getScore = (username) => {
  connection.connect();

  connection.query('SELECT * FROM users WHERE username = ?', [username], (error, result) => {
    if (error) throw error;
  });

  connection.end();

  // todo: return the request
};


const findUser = (username, cb) => {
  const query = `SELECT * FROM users WHERE email = '${username}'`;
  console.log(query);
  return connection.query(query, cb);
};


module.exports = { storeUserData, storeTokenData, getScore, findUser };

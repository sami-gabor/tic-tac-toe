const connection = require('./connection.js');


const storeUserData = (username, password, email) => {
  // const results = [
  //   [username, password, email],
  // ];
  const results = [
    [password, email],
  ];

  connection.connect();

  // // id, username, email, password, score, joined
  // connection.query('INSERT INTO users (username, password, email) VALUES ?', [user], (error) => {
  //   if (error) throw error;
  // });

  // id, hash, user_id
  connection.query('INSERT INTO tokens (hash, user_id) VALUES (?, (SELECT id FROM users WHERE email = ?))', [results], (error) => {
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


const checkUser = (username, password) => {
  const records = [
    [username, password],
  ];

  connection.connect();

  connection.query('SELECT username, password FROM users WHERE username = ? AND password = ?', [records], (error) => {
    if (error) throw error;
  });

  connection.end();
};


module.exports = { storeUserData, getScore, checkUser };

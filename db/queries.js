const connection = require('./connection.js');


const storeUserData = (username, password, email) => {
  const records = [
    [username, password, email],
  ];

  connection.connect();

  connection.query('INSERT INTO users (username, password, email) VALUES ?', [records], (error) => {
    if (error) throw error;
  });

  connection.end();
};


const getScore = (username) => {
  connection.connect();

  connection.query('SELECT * FROM users WHERE username = ?', [username], (error) => {
    if (error) throw error;
  });

  connection.end();
};


module.exports = { storeUserData, getScore };

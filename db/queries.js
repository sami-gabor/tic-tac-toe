const connection = require('./connection.js');


const storeUserData = (username, password, email) => {
  const results = [
    [username, password, email],
  ];

  // id, username, email, password, score, joined
  connection.query('INSERT INTO users (username, password, email) VALUES ?', [results], (error) => {
    if (error) throw error;
  });
};


const storeToken = (token, id) => {
  // id, token, user_id
  connection.query(`INSERT INTO tokens (token, user_id) VALUES ("${token}", ${id})`, (error) => {
    if (error) throw error;
  });
};


const findUser = (username, cb) => {
  const query = `SELECT * FROM users WHERE email = '${username}' LIMIT 1`;
  return connection.query(query, cb)[0];
};


const searchToken = (token, cb) => {
  const query = `SELECT * FROM users JOIN tokens ON users.id = (SELECT user_id FROM tokens WHERE token = "${token}") ORDER BY tokens.id DESC LIMIT 1`;
  return connection.query(query, cb);
};


const updateScore = (score, id) => {
  connection.query(`UPDATE users SET score = ${score} WHERE id = ${id}`, (error) => {
    if (error) throw error;
  });
};


const getUserByToken = (token, cb) => {
  const query = `
    SELECT * FROM tokens AS t 
    INNER JOIN users AS u ON t.user_id = u.id
    WHERE t.token = "${token}" 
  `;
  return connection.query(query, cb);
};


const getUsernamesAndScores = (cb) => {
  const query = 'SELECT username, score FROM users ORDER BY score DESC';
  return connection.query(query, cb);
};

const getScores = (cb) => {
  const query = 'SELECT score FROM users ORDER BY score DESC';
  return connection.query(query, cb);
};

const getUserRank = (score, cb) => {
  const query = `SELECT score FROM users WHERE users.score >= ${score} ORDER BY score DESC`;
  return connection.query(query, cb);
};


module.exports = {
  storeUserData, storeToken, findUser, searchToken, updateScore, getUserByToken, getUsernamesAndScores, getScores,
};

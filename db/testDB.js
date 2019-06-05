const db = require('./queries.js');


db.storeUserData('test5', 't5', 'test5@gmail.com');


console.log('Score: ', db.getScore('sam'));

const crypto = require('crypto');


// generate a hash from a "password" havind a key "salt"
const key = crypto.pbkdf2Sync('password', 'salt', 1000, 128, 'sha512').toString('hex');
console.log(key);

// generate a random hash of 256 char
const hash = crypto.randomBytes(128).toString('hex');
console.log(hash);

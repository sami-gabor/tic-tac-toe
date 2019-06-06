const bcrypt = require('bcrypt');

const saltRounds = 10;
const myPlaintextPassword = 'secret';
const someOtherPlaintextPassword = 'not_secret';


bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
  console.log('hashed: ', hash);
});


bcrypt.compare(myPlaintextPassword, '$2b$10$4btSrcRaGOvuRVB3eeZDrOcUh82Qf8FvY0GG8WpQ1RXlbrh6LuNdG', (err, res) => {
  console.log(res);
});

bcrypt.compare(someOtherPlaintextPassword, '$2b$10$4btSrcRaGOvuRVB3eeZDrOcUh82Qf8FvY0GG8WpQ1RXlbrh6LuNdG', (err, res) => {
  console.log(res);
});

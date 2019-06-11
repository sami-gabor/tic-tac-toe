const path = require('path');
const passport = require('passport');
const crypto = require('crypto');
const db = require('../db/queries.js');

function ensureAuthMiddleware(req, res, next) {
  const { token } = req.signedCookies; // retrive the token from cookies

  if (!token) {
    return res.redirect('/login');
  }

  // search db for token
  db.searchToken(token, (err, result) => { // result will have data from both tables(users & tokens)
    // if nothing found redirect
    if (err) {
      return res.redirect('/failed');
    }

    if (token === result[0].token) {
      // if found, query for user and store on req.user and call next() --> stored by passport-local
      next();
    }
  });
}

module.exports = (app) => {
  app.get('/', ensureAuthMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
  });

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
  });

  app.get('/failed', (req, res) => {
    res.send('<h2>Username and/or password are incorrect</h2>');
  });

  app.get('/logout', (req, res) => {
    res.clearCookie('token');
    req.logout();
    res.redirect('/login');
  });

  app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
  });


  app.get('/login-github',
    (req, res, next) => {
      next(); // optional middleware
    },
    passport.authenticate('github')); // username gets assigned to req.user(the session clears when the server restarts)

  app.get('/auth', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/failed',
  }));


  app.post('/login-local',
    passport.authenticate('local', { failureRedirect: '/failed' }),
    (req, res) => { // req.user --> array of RowDataPacket
      console.log('111', req.user)

      const token = crypto.randomBytes(128).toString('hex');
      db.storeToken(token, req.user[0].id);
      res.cookie('token', token, { signed: true }); // store token to cookies

      res.redirect('/');
    });


  app.post('/register-local', (req, res) => {
    const secret = 'Express';
    const hash = crypto.pbkdf2Sync(req.body.password, secret, 1000, 128, 'sha256').toString('hex');

    db.storeUserData(req.body.username, hash, req.body.email);

    res.redirect('/login');
  });
};

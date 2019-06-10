const path = require('path');
const passport = require('passport');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../db/queries.js');


module.exports = (app) => {
  app.get('/', (req, res) => {
    // todo: check cookie token
    if (req.user) {
      res.sendFile(path.join(__dirname, '../views/index.html'));
    } else {
      res.sendFile(path.join(__dirname, '../views/login.html'));
    }
  });
  app.get('/local', (req, res) => {
    res.redirect('/');
  });


  app.get('/login', (req, res) => {
    res.redirect('/');
  });

  app.get('/logout', (req, res) => {
    res.clearCookie('test');
    req.logout();
    res.redirect('/');
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
    failureRedirect: '/loginFailed',
  }));


  app.post('/login-local', passport.authenticate('local', {
    successRedirect: '/local',
    failureRedirect: '/loginFailed',
  }));


  app.post('/register-local', (req, res) => {
    // // handle local register with bcrypt
    // const saltRounds = 10;
    // bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    //   db.storeUserData(req.body.username, hash, req.body.email);
    // });


    // handle local register with crypto
    const secret = 'Express';
    const hash = crypto.pbkdf2Sync(req.body.password, secret, 1000, 128, 'sha256').toString('hex');

    db.storeUserData(req.body.username, hash, req.body.email);

    res.redirect('/login');
  });
};

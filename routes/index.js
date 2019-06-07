const path = require('path');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../db/queries.js');


module.exports = (app) => {
  app.get('/', (req, res) => {
    // todo: check cookie token
    console.log(222, req.user);
    if (req.user) {
      res.sendFile(path.join(__dirname, '../views/index.html'));
    } else {
      res.sendFile(path.join(__dirname, '../views/login.html'));
    }
  });
  app.get('/local', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
  });


  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
  });

  app.get('/logout', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
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
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      db.storeUserData(req.body.username, hash, req.body.email);
    });

    res.redirect('/login');
  });
};

const path = require('path');
const passport = require('passport');
const crypto = require('crypto');
const db = require('../db/queries.js');

const secret = 'Express is awesome!';

function ensureAuthMiddleware(req, res, next) {
  const { token } = req.cookies; // retrive the token from cookies

  if (!token) {
    return res.redirect('/login');
  }

  // if token found, query for user and store on req.user and call next()
  // stored by passport-local
  db.searchToken(token, (err, result) => { // result will have data from both tables(users & tokens)
    if (err) {
      return res.redirect('/db-error');
    }

    if (result[0] && token === result[0].token) {
      next();
    } else {
      res.redirect('/login'); // github user saved to db and it should log not redirect to login(on a second try it works!)
    }
  });
}

module.exports = (app) => {
  app.get('/', ensureAuthMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html')); // [, dataforview]
  });

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
  });

  app.get('/failed', (req, res) => {
    res.send('<h2>Username and/or password are incorrect</h2>');
  });

  app.get('/db-error', (req, res) => {
    res.send('<h2>There was an error while trying to connect to the database</h2>');
  });


  app.get('/logout', (req, res) => {
    res.clearCookie('token');
    req.logout();
    res.redirect('/login');
  });

  app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
  });

  app.get('/ranking', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/ranking.html'));
  });

  app.get('/users', (req, res) => {
    db.getUsernamesAndScores((err, result) => {
      res.json(result);
    });
  });


  app.get('/login-github',
    (req, res, next) => {
      next(); // optional middleware
    },
    passport.authenticate('github')); // username gets assigned to req.user(the session clears when the server restarts)

  app.get('/auth', passport.authenticate('github', { failureRedirect: '/failed' }),
    (req, res) => {
      const { username } = req.user;
      const password = crypto.randomBytes(128).toString('hex');
      const email = req.user.emails[0].value;

      db.getUserByEmail(email, (error, result) => {
        const token = crypto.randomBytes(128).toString('hex');

        if (error) {
          console.log('Error database connection: ', error);
        }

        if (!result[0]) {
          db.storeUserData(username, password, email);
          console.log('A profile was created, but not automatically redirected to homepage. Must click SIGN IN WITH GITHUB again...');
        } else if (result[0].username === req.user.username) {
          db.storeToken(token, result[0].id);
        }

        res.cookie('token', token);
        res.redirect('/');
      });
    });


  app.post('/login-local',
    (req, res, next) => {
      next(); // optional middleware
    },

    passport.authenticate('local', { failureRedirect: '/failed' }),

    (req, res) => { // req.user --> array of RowDataPacket
      const token = crypto.randomBytes(128).toString('hex');

      db.storeToken(token, req.user[0].id);
      res.cookie('token', token);
      res.redirect('/');
    });


  app.post('/register-local', (req, res) => {
    const hash = crypto.pbkdf2Sync(req.body.password, secret, 1000, 128, 'sha256').toString('hex');
    db.storeUserData(req.body.username, hash, req.body.email);
    res.redirect('/login');
  });
};

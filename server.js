const generateMatrix = (rows = 3, columns = 3) => {
  const matrix = [];

  const createRow = cols => new Array(cols).fill('');

  for (let i = 0; i < rows; i += 1) {
    matrix.push(createRow(columns));
  }

  return matrix;
};
const matrix = generateMatrix(3, 3);


const checkRow = (rowIndex, currentSelection) => {
  const selections = [];

  matrix[rowIndex].forEach((col) => {
    if (col === currentSelection) {
      selections.push(col);
    }
  });

  return selections.length === matrix.length;
};


const checkCol = (colIndex, currentSelection) => {
  const selections = [];

  matrix.forEach((row) => {
    const cellToCheck = row[colIndex];
    if (cellToCheck === currentSelection) {
      selections.push(cellToCheck);
    }
  });

  return selections.length === matrix.length;
};


const checkPrincipalDiagonal = (currentSelection) => {
  const selections = [];

  matrix.forEach((row, index) => {
    const cellToCheck = row[index];
    if (cellToCheck === currentSelection) {
      selections.push(cellToCheck);
    }
  });

  return selections.length === matrix.length;
};


const checkSecondaryDiagonal = (currentSelection) => {
  const selections = [];

  matrix.forEach((row, index) => {
    const cellToCheck = row[matrix.length - index - 1];
    if (cellToCheck === currentSelection) {
      selections.push(cellToCheck);
    }
  });

  return selections.length === matrix.length;
};


const checkWinner = ([rowIndex, colIndex], currentSelection) => {
  if (checkRow(rowIndex, currentSelection)
    || checkCol(colIndex, currentSelection)
    || ((rowIndex === colIndex) && checkPrincipalDiagonal(currentSelection))
    || ((parseInt(rowIndex, 10) + parseInt(colIndex, 10) === matrix.length - 1) && checkSecondaryDiagonal(currentSelection))) {
    return true;
  }

  return false;
};


const updateMatrix = ([rowIndex, colIndex], clientSelection) => {
  matrix[rowIndex][colIndex] = clientSelection;
};

// ============================================================= //
// ====== handle communication channels with clients =========== //
// ============================================================= //

const io = require('socket.io');
const generateName = require('sillyname');

const server = io.listen(8000);
let currentMoveIsX = true;
let movesCount = 0;
const rooms = [];

const createRoom = (playerName, roomId) => {
  rooms.push({ roomId, namePlayerOne: playerName, namePlayerTwo: '' });
};

const nameIsTaken = (room, name) => {
  return room.namePlayerOne === name;
};

const roomIsFull = (room) => {
  return Boolean(room.namePlayerTwo);
};


server.on('connection', (socket) => {
  const playerId = socket.id;

  socket.on('new room', (name, room) => {
    const playerName = name || generateName();
    const roomId = room || socket.id;

    createRoom(playerName, roomId);
    socket.join(roomId);
    socket.emit('wait player 2', 'Waiting for the second player to join.');
    socket.emit('set room id hash and player name', roomId, playerName);
    socket.broadcast.emit('room created', roomId);
  });

  socket.on('join room', (name, roomId) => {
    const playerName = name || generateName();
    let roomToJoin;
    for (let i = 0; i < rooms.length; i += 1) {
      if (rooms[i].roomId === roomId) {
        roomToJoin = rooms[i];
        break;
      }
    }

    if (roomToJoin && !nameIsTaken(roomToJoin, playerName) && !roomIsFull(roomToJoin)) {
      socket.join(roomId);
      roomToJoin.namePlayerTwo = playerName;

      socket.broadcast.to(roomId).emit('start game', matrix);
      socket.broadcast.to(roomId).emit('message', 'your first move');

      socket.emit('start game', matrix);
      socket.emit('freeze game', 'wait for player one\'s first move');
      socket.emit('set room id hash and player name', roomId, playerName);
    } else {
      socket.emit('message', 'Invalid name and/or room ID');
    }
  });


  // verify if the message reveived(obj) has the cellIndex property
  socket.on('game input', (cellIndex, roomIdHash) => { // change roomIdHash with some hash
    let winner;
    movesCount += 1;
    // determine what the current cellValue is and update the matrix with it
    const cellValue = currentMoveIsX ? 'X' : '0';
    updateMatrix(cellIndex, cellValue);
    currentMoveIsX = !currentMoveIsX;

    socket.emit('update game', cellIndex, cellValue); // broadcast message back to sender
    socket.emit('freeze game', 'wait a second...');
    socket.broadcast.to(roomIdHash).emit('update game', cellIndex, cellValue); // broadcast message to everyone except the sender
    socket.broadcast.to(roomIdHash).emit('unfreeze game', 'It\'s your turn!');


    if (checkWinner(cellIndex, cellValue)) {
      winner = cellValue;
      socket.broadcast.to(roomIdHash).emit('game over', `Player ${winner} won!`);
      socket.emit('game over', `Player ${winner} won!`);
    } else if (movesCount === 9) {
      socket.broadcast.to(roomIdHash).emit('game over', 'It\'s a tie. Nobody won!');
      socket.emit('game over', 'It\'s a tie. Nobody won!');
    }
  });

  socket.on('disconnect', () => {
    console.log(`disconnected from: ${playerId}`);
    socket.broadcast.emit('message', `${playerId} was disconnected.`);
  });

  const standardInput = process.stdin;
  standardInput.setEncoding('utf-8');
  standardInput.on('data', (data) => {
    if (data === 'exit\n') {
      process.exit();
    } else {
      socket.broadcast.emit('message', data); // broadcast the message to everyone except the sender
      socket.emit('message', { matrix }); // broadcast the message to sender
    }
  });

  console.log(`${socket.id} has connected.`);
});


// ============================================================= //
// ===================== handle auth github ==================== //
// ============================================================= //


const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
// const mysql = require('mysql');
const passportConfig = require('./config');
const db = require('./db/queries.js');


const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.use(session({
  secret: 'Express is awesome!',
  resave: false,
  saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));


passport.use(new GitHubStrategy(passportConfig, (accessToken, refreshToken, profile, cb) => {
  console.log('accessToken, refreshToken: ', accessToken, refreshToken);
  return cb(null, profile);
}));


passport.use(new LocalStrategy((username, password, done) => {
  console.log('LocalStrategy!!!: ', username, password, done);
  // console.log(db.getScore(email, password));
  const hasAccess = false;
  if (hasAccess) {
    return done(null, username);
  }
  return done(null, false);
}));


passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});


app.get('/', (req, res) => {
  console.log('req.body/: ', req.body, req.user);
  if (req.user) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
  } else {
    res.sendFile(path.join(__dirname, '/views/login.html'));
  }
});
app.get('/local', (req, res) => {
  console.log('req.body/local: ', req.user);

  res.sendFile(path.join(__dirname, '/views/index.html'));
});


app.get('/login', (req, res) => {
  console.log('req.body/login: ', req.body);
  res.sendFile(path.join(__dirname, '/views/login.html'));
});


app.get('/register', (req, res) => {
  console.log('req.body/register: ', req.body);
  res.sendFile(path.join(__dirname, '/views/register.html'));
});


app.get('/login-github',
  (req, res, next) => {
    console.log('!!! testing login middleware...');
    next();
  },
  passport.authenticate('github')); // username gets assigned to req.user(the session clears when the server restarts)


app.get('/auth', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/loginFailed',
}));


app.post('/login-local', passport.authenticate('local', {
  successRedirect: '/local',
  failureRedirect: '/register',
}));

app.post('/login-local', (req, res) => {
  res.redirect('/local');
});


app.post('/register-local', (req, res) => {
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    db.storeUserData(req.body.username, hash, req.body.email);
  });

  res.redirect('/login');
});

app.listen(3000);

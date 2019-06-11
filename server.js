const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const crypto = require('crypto');
const io = require('socket.io');
const generateName = require('sillyname');

const passportConfig = require('./config');
const db = require('./db/queries.js');
const game = require('./utils.js');

const secret = 'Express is awoseme!'; // used to sign cookies

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(session({
  secret,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(cookieParser(secret));


require('./routes/index.js')(app);


passport.use(new GitHubStrategy(passportConfig, (accessToken, refreshToken, profile, cb) => {
  return cb(null, profile);
}));

passport.use(new LocalStrategy((username, password, done) => {
  db.findUser(username, (err, user) => {
    if (err) {
      return done(null, false);
    }

    if (!user) {
      return done(null, false);
    }

    const secret = 'Express';

    return crypto.pbkdf2(password, secret, 1000, 128, 'sha256', (error, derivedKey) => {
      if (!error && derivedKey.toString('hex') === user[0].password) {
        return done(null, user);
      }
      return done(null, false);
    });
  });
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});


app.listen(3000);


// ============================================================= //
// ====== handle communication channels with clients =========== //
// ============================================================= //


const matrix = game.generateMatrix(3, 3);
const server = io.listen(8000);
let currentMoveIsX = true;
let movesCount = 0;
const rooms = [];


const updateMatrix = ([rowIndex, colIndex], clientSelection) => {
  matrix[rowIndex][colIndex] = clientSelection;
};

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

    if (game.checkWinner(matrix, cellIndex, cellValue)) {
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

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
// ========================== handle auth ====================== //
// ============================================================= //


const express = require('express');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');

passport.use(new LocalStrategy((username, password, done) => {
  db.users.findByUsername(username, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}));


const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.post('/', (req, res) => res.json('Hello World!'));
app.post('/login', (req, res) => res.json('Hello World to login!'));

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

app.listen(3000);

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


const checkWinner = (cellIndex, currentSelection) => {
  const [rowIndex, colIndex] = cellIndex;

  if (checkRow(rowIndex, currentSelection)
    || checkCol(colIndex, currentSelection)
    || ((rowIndex === colIndex) && checkPrincipalDiagonal(currentSelection))
    || ((parseInt(rowIndex, 10) + parseInt(colIndex, 10) === matrix.length - 1) && checkSecondaryDiagonal(currentSelection))) {
    return true;
  }

  return false;
};


const updateMatrix = ([rowIndex, colIndex], clientSelection) => {
  // const [rowIndex, colIndex] = index;
  matrix[rowIndex][colIndex] = clientSelection;
};


// handle communication channels with clients
const io = require('socket.io');

const server = io.listen(8000);
let currentMoveIsX = true;
let movesCount = 0;
// will store the name, ID for every player
const players = [];
const rooms = [];

const addPlayer = (name, socket) => {
  players.push({ name, id: socket.id });
  console.log(`${socket.id} was succesfully changed to "${name}".`);
};

const validName = (name) => {
  for (let i = 0; i < players.length; i += 1) {
    if (players[i].name === name) {
      return false;
    }
  }
  return true;
};

const startGame = (socket) => {
  // broadcast back to sender
  socket.emit('startGame', matrix);
  socket.emit('freeze game', `Wait for ${players[0].name} to move.`);
  // broadcast to everyone except the sender
  socket.broadcast.emit('startGame', matrix);
  socket.broadcast.emit('message', 'It\' your turn!');
};

const createRoom = (playerName, roomId) => {
  rooms.push({ roomId, namePlayerOne: playerName, namePlayerTwo: '' });
};

const emitCreateRoomConfirmation = (socket) => {
  socket.emit('room created', socket.id);
};


server.on('connection', (socket) => {
  const playerId = socket.id;

  socket.on('new room', (playerName, roomId) => {
    createRoom(playerName, roomId);
    socket.join(roomId);
    socket.emit('wait player 2', 'Waiting for the second player to join.');
    socket.broadcast.emit('room created', roomId);
  });

  socket.on('join room', (playerName, roomId) => {
    let roomToJoin;
    for (let i = 0; i < rooms.length; i += 1) {
      if (rooms[i].roomId === roomId) {
        roomToJoin = rooms[i];
        break;
      }
    }

    if (roomToJoin && roomToJoin.namePlayerOne !== playerName) {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit('startGame', matrix);
      socket.emit('startGame', matrix);
    } else {
      socket.emit('message', 'Invalid name and/or room ID');
    }
  });


  // verify if the message reveived(obj) has the cellIndex property
  socket.on('gameInput', (cellIndex) => {
    let winner;
    movesCount += 1;
    // determine what the current cellValue is and update the matrix with it
    const cellValue = currentMoveIsX ? 'X' : '0';
    updateMatrix(cellIndex, cellValue);
    currentMoveIsX = !currentMoveIsX;

    socket.emit('freeze game', 'wait a sec...');
    socket.broadcast.emit('unfreeze game', 'It\'s your turn!');

    socket.broadcast.emit('updateGame', cellIndex, cellValue); // broadcast message to everyone except the sender
    socket.emit('updateGame', cellIndex, cellValue); // broadcast message back to sender

    if (checkWinner(cellIndex, cellValue)) {
      winner = cellValue;
      socket.broadcast.emit('gameOver', `Player ${winner} won!`);
      socket.emit('gameOver', `Player ${winner} won!`);
    } else if (movesCount === 9) {
      socket.broadcast.emit('gameOver', 'It\'s a tie. Nobody won!');
      socket.emit('gameOver', 'It\'s a tie. Nobody won!');
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

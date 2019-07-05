const ioClient = io.connect('http://localhost:8000');


const hideElement = (elementId) => {
  const $element = document.getElementById(elementId);
  $element.classList.add('hidden');
};

const showElement = (elementId) => {
  const $element = document.getElementById(elementId);
  $element.classList.remove('hidden');
};

function createTable(arr) {
  hideElement('container-create-new-game');

  const $container = document.getElementById('container-game-board');
  $container.innerHTML = '';
  const $table = document.createElement('table');
  const $tableBody = document.createElement('tbody');

  arr.forEach((row, rowIndex) => {
    const $tableRow = document.createElement('tr');

    row.forEach((col, colIndex) => {
      const $tableData = document.createElement('td');
      $tableData.setAttribute('id', `${rowIndex}${colIndex}`);
      $tableData.appendChild(document.createTextNode(col));
      $tableRow.appendChild($tableData);
    });

    $tableBody.appendChild($tableRow);
  });

  $table.appendChild($tableBody);
  $container.innerHTML = '';
  $container.appendChild($table);
}


const updateMessageField = (message) => {
  const $message = document.getElementById('messageText');
  $message.innerHTML = message;
};


const updateGameBoard = (cellIndex, currentPlayerSelection) => {
  const $cell = document.getElementById(cellIndex);
  const classes = $cell.classList;
  $cell.innerHTML = currentPlayerSelection;

  if (!classes.contains('selected')) {
    $cell.classList.add('selected');
  }
};


const handleGameClick = (e) => {
  const cellIndex = e.target.id;
  const $cell = document.getElementById(cellIndex);
  const classes = $cell.classList;

  if (!classes.contains('selected')) {
    $cell.classList.add('selected');
    const roomName = document.getElementById('room-name').innerText;

    ioClient.emit('game input', cellIndex, roomName);
  }
};


const freezeBoardGame = () => {
  const $boardGame = document.querySelector('tbody');
  $boardGame.removeEventListener('click', handleGameClick);
};


// create a room and automatically add the player to it
const $newGameButton = document.getElementById('new');
$newGameButton.addEventListener('click', () => {
  const roomId = document.getElementById('roomNew').value;
  hideElement('activeRooms');
  hideElement('container-create-new-game');
  // document.getElementById('container-create-new-game').innerHTML = '';
  showElement('messageBox');

  ioClient.emit('new room', roomId);
});

const addGameInputListener = () => {
  // send the game input(from the board game) to server
  const $boardGame = document.querySelector('tbody');
  $boardGame.addEventListener('click', handleGameClick);
};

const addNewRoom = (roomName) => {
  const $roomsList = document.getElementById('rooms');
  const $room = document.createElement('li');
  $room.appendChild(document.createTextNode(roomName));
  $roomsList.appendChild($room);

  console.log('addNewRoom: ', roomName);

  $room.addEventListener('click', () => {
    hideElement('activeRooms');
    showElement('messageBox');
    // document.getElementById('container-create-new-game').innerHTML = '';
    hideElement('container-create-new-game');

    ioClient.emit('join room', roomName);
  });
};

const displayUserStats = (user, room = '') => {
  document.getElementById('room-name').innerText = room;
  document.getElementById('player-name').innerText = `Hello, ${user.username}`;
  document.getElementById('player-score').innerText = user.score;
  document.getElementById('player-rank').innerText = user.rank;
};

const handleRematchButton = () => {
  document.getElementById('rematch').removeEventListener('click', handleRematchButton);
  hideElement('rematch');

  const playerName = document.getElementById('player-name').innerText;
  ioClient.emit('initiate rematch', playerName);
};

const displayRematchButton = () => {
  showElement('rematch');
  document.getElementById('rematch').addEventListener('click', handleRematchButton);
};

const leaveRoom = () => {
  showElement('container-create-new-game');
  // hideElement('container-game-board');
  hideElement('messageBox');

  const roomName = document.getElementById('room-name').innerText;
  console.log(roomName, document.getElementById('container-create-new-game'));
  ioClient.emit('leave room', roomName);
};

const handleLeaveRoomButton = () => {
  hideElement('leaveRoomButton');
  showElement('container-user-input');
  leaveRoom();
};

const displayLeaveRoomButton = () => {
  showElement('leaveRoomButton');
  document.getElementById('leaveRoomButton').addEventListener('click', handleLeaveRoomButton);
};

const acceptRematch = () => {
  const $rematchButton = document.getElementById('rematch');
  $rematchButton.removeEventListener('click', handleRematchButton);
  $rematchButton.innerHTML = 'Accept Rematch?';

  $rematchButton.addEventListener('click', () => {
    ioClient.emit('accept rematch');
    $rematchButton.innerHTML = 'Rematch';
    $rematchButton.classList.add('hidden');
  });
};

const displayExistingRooms = (rooms) => {
  document.getElementById('rooms').innerHTML = '';
  rooms.forEach((room) => {
    addNewRoom(room.id);
  });
};

// set up incomming communication channels
ioClient.on('connect', () => {
  console.log('Client has connected to the server!');
});

ioClient.on('display existing rooms', (rooms) => {
  displayExistingRooms(rooms);
  console.log('display rooms now!', rooms)
});

ioClient.on('room created', (roomId) => {
  addNewRoom(roomId);
});

ioClient.on('start game', (emptyMatrix) => {
  createTable(emptyMatrix);
  addGameInputListener();
});

ioClient.on('wait player 2', (message) => {
  // clear page and display the waiting message
  // document.getElementById('container-create-new-game').innerHTML = '';
  hideElement('container-create-new-game');
  updateMessageField(message);
});

ioClient.on('the room is full', () => {
  console.log('The room is full!');
});

ioClient.on('user stats on connection', (user) => {
  displayUserStats(user);
});

ioClient.on('update user stats', (user, room) => {
  displayUserStats(user, room);
});

ioClient.on('update score', (playerScore) => {
  document.getElementById('player-score').innerText = playerScore;
});

ioClient.on('update game', (cellIndex, cellValue) => {
  updateGameBoard(cellIndex, cellValue);
});

ioClient.on('game over', (message) => {
  updateMessageField(message);
  freezeBoardGame();
  displayRematchButton();
  displayLeaveRoomButton();
});

ioClient.on('freeze game', (message) => {
  updateMessageField(message);
  freezeBoardGame();
});

ioClient.on('unfreeze game', (message) => {
  updateMessageField(message);
  addGameInputListener();
});


ioClient.on('message', (message) => {
  updateMessageField(message);
});

ioClient.on('disconnect', () => {
  console.log('The server has disconnected!');
});

ioClient.on('rematch was initiated', () => {
  acceptRematch();
});

ioClient.on('display leave room button', () => {
  displayLeaveRoomButton();
});

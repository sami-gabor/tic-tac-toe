const ioClient = io.connect('http://165.22.72.239:8000');


const hideElement = (elementId) => {
  const $element = document.getElementById(elementId);
  $element.classList.add('hidden');
};

const showElement = (elementId) => {
  const $element = document.getElementById(elementId);
  if ($element) {
    $element.classList.remove('hidden');
  }
};

function createTable(arr) {
  document.getElementById('container-create-new-game').innerHTML = '';

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
  document.getElementById('container-create-new-game').innerHTML = '';
  showElement('messageBox');
  showElement('leaveRoomButton');

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

  $room.addEventListener('click', () => {
    hideElement('activeRooms');
    showElement('messageBox');
    showElement('leaveRoomButton');
    document.getElementById('container-create-new-game').innerHTML = '';

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
  document.getElementById('initiate-rematch').removeEventListener('click', handleRematchButton);

  const playerName = document.getElementById('player-name').innerText;
  const roomName = document.getElementById('room-name').innerText;
  ioClient.emit('initiate rematch', playerName, roomName);
  hideElement('initiate-rematch');
};

const displayRematchButton = () => {
  showElement('initiate-rematch');
  document.getElementById('initiate-rematch').addEventListener('click', handleRematchButton);
};

const leaveRoom = () => {
  const roomName = document.getElementById('room-name').innerText;
  document.getElementById('container-create-new-game').innerHTML = '';
  ioClient.emit('leave room', roomName);
};

const displayLeaveRoomButton = () => {
  document.getElementById('leaveRoomButton').addEventListener('click', leaveRoom);
};

const acceptRematch = () => {
  showElement('accept-rematch');
  const $rematchButton = document.getElementById('accept-rematch');

  $rematchButton.addEventListener('click', () => {
    const roomName = document.getElementById('room-name').innerText;
    ioClient.emit('accept rematch', roomName);
    hideElement('accept-rematch');
  });
};

const displayExistingRooms = (rooms) => {
  document.getElementById('rooms').innerHTML = '';
  rooms.forEach((room) => {
    addNewRoom(room.name);
  });
};

// set up incomming communication channels
ioClient.on('connect', () => {
  console.log('Client has connected to the server!');
});

ioClient.on('display existing rooms', (rooms) => {
  displayExistingRooms(rooms);
});

ioClient.on('room created', (roomId) => {
  addNewRoom(roomId);
});

ioClient.on('start game', (emptyMatrix) => {
  createTable(emptyMatrix);
  addGameInputListener();
  hideElement('activeRooms');
});

ioClient.on('wait player 2', (message) => {
  updateMessageField(message);
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
  showElement('messageText');
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
  hideElement('initiate-rematch');
});

ioClient.on('display leave room button', () => {
  displayLeaveRoomButton();
});

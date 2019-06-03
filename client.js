const ioClient = io.connect('http://localhost:8000');


function createTable(arr) {
  const $container = document.getElementById('container');
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
  const $message = document.getElementById('messages');
  $message.innerHTML = message;
};


const updateGameBoard = (cellIndex, currentPlayerSelection) => {
  const $cell = document.getElementById(cellIndex);
  $cell.innerHTML = currentPlayerSelection;
};


const handleGameClick = (e) => {
  const cellIndex = e.target.id;
  const roomIdHash = document.getElementById('room-id-hash').innerText;
  ioClient.emit('game input', cellIndex, roomIdHash); // change roomId with some hash
};


const freezeBoardGame = () => {
  const $boardGame = document.querySelector('tbody');
  $boardGame.removeEventListener('click', handleGameClick);
};


// create a room and automatically add the player to it
const $newGameButton = document.getElementById('new');
$newGameButton.addEventListener('click', () => {
  const playerName = document.getElementById('nameNew').value;
  const roomId = document.getElementById('roomNew').value;
  ioClient.emit('new room', playerName, roomId);
});

// send the player name(from the input field) to server
const $joinGameButton = document.getElementById('join');
$joinGameButton.addEventListener('click', () => {
  const playerName = document.getElementById('nameJoin').value;
  const roomId = document.getElementById('roomJoin').value;
  ioClient.emit('join room', playerName, roomId);
});


const addGameInputListener = () => {
  // send the game input(from the board game) to server
  const $boardGame = document.querySelector('tbody');
  $boardGame.addEventListener('click', handleGameClick);
};

const addNewRoom = (roomId) => {
  const $roomsList = document.getElementById('rooms');
  const $room = document.createElement('li');
  $room.appendChild(document.createTextNode(roomId));
  $roomsList.appendChild($room);

  $room.addEventListener('click', () => {
    document.getElementById('container').innerHTML = '';
    ioClient.emit('join room', undefined, roomId);
  });
};


// set up incomming communication channels
ioClient.on('connect', () => {
  console.log('Client has connected to the server!');
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
  document.getElementById('container').innerHTML = '';
  updateMessageField(message);
});

ioClient.on('set room id hash and player name', (roomIdHash, playerName) => {
  document.getElementById('room-id-hash').innerText = roomIdHash;
  document.getElementById('player-name').innerText = playerName;
});

ioClient.on('update game', (cellIndex, cellValue) => {
  updateGameBoard(cellIndex, cellValue);
});

ioClient.on('game over', (message) => {
  updateMessageField(message);
  freezeBoardGame();
});

ioClient.on('freeze game', (message) => {
  updateMessageField(message);
  freezeBoardGame();
});

ioClient.on('unfreeze game', (message) => {
  console.log(message);
  updateMessageField(message);
  addGameInputListener();
});


ioClient.on('message', (message) => {
  updateMessageField(message);
});

ioClient.on('disconnect', () => console.log('The server has disconnected!'));


// ============================================================= //
// ========================== handle auth ====================== //
// ============================================================= //


document.addEventListener('DOMContentLoaded', () => {
  const $login = document.getElementById('login-btn');

  $login.addEventListener('click', () => {
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;

    const url = 'http://localhost:3000/login';
    const data = { username, password };

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error('Error:', error));
  });
});

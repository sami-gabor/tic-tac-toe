const generateMatrix = (rows = 3, columns = 3) => {
  const matrix = [];

  const createRow = cols => new Array(cols).fill('');

  for (let i = 0; i < rows; i += 1) {
    matrix.push(createRow(columns));
  }

  return matrix;
};


const checkRow = (matrix, rowIndex, currentSelection) => {
  const selections = [];

  matrix[rowIndex].forEach((col) => {
    if (col === currentSelection) {
      selections.push(col);
    }
  });

  return selections.length === matrix.length;
};


const checkCol = (matrix, colIndex, currentSelection) => {
  const selections = [];

  matrix.forEach((row) => {
    const cellToCheck = row[colIndex];
    if (cellToCheck === currentSelection) {
      selections.push(cellToCheck);
    }
  });

  return selections.length === matrix.length;
};


const checkPrincipalDiagonal = (matrix, currentSelection) => {
  const selections = [];

  matrix.forEach((row, index) => {
    const cellToCheck = row[index];
    if (cellToCheck === currentSelection) {
      selections.push(cellToCheck);
    }
  });

  return selections.length === matrix.length;
};


const checkSecondaryDiagonal = (matrix, currentSelection) => {
  const selections = [];

  matrix.forEach((row, index) => {
    const cellToCheck = row[matrix.length - index - 1];
    if (cellToCheck === currentSelection) {
      selections.push(cellToCheck);
    }
  });

  return selections.length === matrix.length;
};


const checkWinner = (matrix, [rowIndex, colIndex], currentSelection) => {
  if (checkRow(matrix, rowIndex, currentSelection)
    || checkCol(matrix, colIndex, currentSelection)
    || ((rowIndex === colIndex) && checkPrincipalDiagonal(matrix, currentSelection))
    || ((parseInt(rowIndex, 10) + parseInt(colIndex, 10) === matrix.length - 1) && checkSecondaryDiagonal(matrix, currentSelection))) {
    return true;
  }

  return false;
};


module.exports = { generateMatrix, checkWinner };

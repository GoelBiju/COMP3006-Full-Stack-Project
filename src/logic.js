const { getGame } = require("./controllers/GameController");

// Make a move on the board given:
//  - game ID
//  - player
//  - column
// Returns the row the move has been made on
async function makeMove(gameId, player, column) {
  let row = -1;

  // Get the game.
  await getGame(gameId).then(async (game) => {
    // Check for next move
    if (game && game.nextMove == player) {
      let board = game.board;
      console.log("Board length: ", game.board.length);

      // Update game board with new player move
      for (let i = 5; i > -1; i--) {
        console.log("Got row: ", board[i]);
        console.log("Got column: ", board[i][column]);

        // Check if the slot is free.
        if (board[i][column] == -1) {
          board[i][column] = player;
          console.log(
            `Made move to [${i}, ${column}] (row, column): ${player}`
          );
          row = i;
          break;
        }
      }

      console.log("New board: ", board);
      // Update game board by marking as modified
      game.board = board;
      game.markModified("board");

      // Update player score
      if (player == 0) {
        game.scoreOne += 1;
        console.log("Updated player 1 score: ", game.scoreOne);
      } else if (player == 1) {
        game.scoreTwo += 1;
        console.log("Updated player 2 score: ", game.scoreTwo);
      }

      await game.save();
      console.log("Updated board: ", game.board);
    }
  });

  return row;
}

// Performs board checks to get the current result:
//  - -1 (error)
//  - 0 (play on)
//  - 1 (horizontal win)
//  - 2 (vertical win)
//  - 3 (diagonal win)
//  - 4 (draw with board being full)
async function performChecks(gameId) {
  let checkResult = -1;

  // Get the game.
  await getGame(gameId).then(async (game) => {
    // Check for next move
    if (game) {
      // Get the board
      let board = game.board;

      if (horizontalCheck(board)) {
        checkResult = 1;
      } else if (verticalCheck(board)) {
        checkResult = 2;
      } else if (diagonalChecks(board)) {
        checkResult = 3;
      } else if (isBoardFull(board)) {
        checkResult = 4;
      } else {
        checkResult = 0;
      }
    }
  });

  return checkResult;
}

// Returns true if all four colours match
// and is not set to the default (-1).
function coinMatchCheck(one, two, three, four) {
  return one == two && one == three && one == four && one != -1;
}

// Check along horizontal row for a win.
function horizontalCheck(board) {
  let matched = false;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < 4; col++) {
      let boardRow = board[row];

      // Check if columns match 4 in a row,
      // on the board row.
      if (
        coinMatchCheck(
          boardRow[col],
          boardRow[col + 1],
          boardRow[col + 2],
          boardRow[col + 3]
        )
      ) {
        matched = true;
      }
    }
  }

  return matched;
}

// Check along vertical columns for a win.
function verticalCheck(board) {
  let matched = false;

  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 3; row++) {
      if (
        coinMatchCheck(
          board[row][col],
          board[row + 1][col],
          board[row + 2][col],
          board[row + 3][col]
        )
      ) {
        matched = true;
      }
    }
  }

  return matched;
}

// Check along diagonal rows/columns for a win.
function diagonalChecks(board) {
  let matched = false;

  // Check from top left to bottom right
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 3; row++) {
      if (
        coinMatchCheck(
          board[row][col],
          board[row + 1][col + 1],
          board[row + 2][col + 2],
          board[row + 3][col + 3]
        )
      ) {
        matched = true;
      }
    }
  }

  if (!matched) {
    // Check from bottom left to top right
    for (let col = 0; col < 4; col++) {
      for (let row = 5; row > 2; row--) {
        if (
          coinMatchCheck(
            board[row][col],
            board[row - 1][col + 1],
            board[row - 2][col + 2],
            board[row - 3][col + 3]
          )
        ) {
          matched = true;
        }
      }
    }
  }

  return matched;
}

// Check the board to see if it is full
function isBoardFull(board) {
  let isFull = true;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < 6; col++) {
      if (board[row][col] == -1) {
        isFull = false;
      }
    }
  }

  return isFull;
}

module.exports = {
  makeMove,
  coinMatchCheck,
  horizontalCheck,
  verticalCheck,
  diagonalChecks,
  isBoardFull,
  performChecks,
};

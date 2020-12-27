// Make a move on the board given:
//  - game ID
//  - player
//  - column

const { getGame } = require("./controllers/Game");

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

      await game.save();
      console.log("Updated board: ", game.board);
    }
  });

  return row;
}

module.exports = {
  makeMove,
};

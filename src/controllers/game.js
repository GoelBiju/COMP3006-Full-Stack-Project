const Game = require("../models/Game");

// Get a game based on ID
const getGame = async (id) => {
  const game = await Game.findById(id).exec();
  console.log("Found game: ", game);
  return game;
};

// // Get the board from a game
// const getBoard = async (id) => {
//   let board = null;

//   await getGame(id).then((game) => {
//     if (game) {
//       board = game.board;
//     }
//   });

//   console.log("Game board: ", board);
//   return board;
// };

// Add a player to the game
const addGamePlayer = async (gameId, username) => {
  let added = false;

  // Get the game to update
  await getGame(gameId).then(async (game) => {
    console.log("Game to add player: ", game);

    // Add the user to the game and save
    if (game && game.players.length < 2 && !game.players.includes(username)) {
      game.players.push(username);
      await game.save();

      added = true;
    }
  });

  console.log("Added: ", added);
  return added;
};

// Get the total number of players
const getGamePlayerCount = async (gameId) => {
  let count = -1;

  await getGame(gameId).then((game) => {
    if (game) {
      count = game.players.length;
    }
  });

  console.log("Got game length: ", count);
  return count;
};

// Get a random player from the game
const getRandomPlayer = async (gameId) => {
  let p;

  await getGame(gameId).then((game) => {
    if (game) {
      p = Math.floor(Math.random() * game.players.length);
    }
  });

  return p;
};

// Get all the game players
const getGamePlayers = async (gameId) => {
  let players = [];

  await getGame(gameId).then((game) => {
    if (game) {
      players = game.players;
    }
  });

  return players;
};

// Get a player from the array
const getGamePlayer = async (gameId, i) => {
  let player;

  await getGame(gameId).then((game) => {
    if (game) {
      player = game.players[i];
    }
  });

  return player;
};

// Switch the next move on a game and return the next player
const switchMove = async (gameId, currentPlayer) => {
  let nextPlayer = -1;

  // Get the game to update
  await getGame(gameId).then(async (game) => {
    console.log("Game to switch move: ", game);

    // Switch the next move to the new player
    if (game && nextMove != -1) {
      if (currentPlayer == 0) {
        game.nextMove = 1;
      } else if (currentPlayer == 1) {
        game.nextMove = 0;
      }
      console.log(
        `Switched from player ${currentPlayer} to player ${game.nextMove}`
      );
      await game.save();

      nextPlayer = game.nextMove;
    }
  });

  return nextPlayer;
};

// Update the next move for a game
const updateNextMove = async (gameId, move) => {
  let updated = false;

  await getGame(gameId).then(async (game) => {
    if (game) {
      game.nextMove = move;
      await game.save();

      updated = true;
    }
  });

  return updated;
};

module.exports = {
  getGame,
  getGamePlayerCount,
  getGamePlayers,
  getGamePlayer,
  getRandomPlayer,
  addGamePlayer,
  updateNextMove,
  switchMove,
};

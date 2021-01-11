const Game = require("../models/Game");

// Get a game based on ID
const getGame = async (id) => {
  const game = await Game.findById(id).exec();
  return game;
};

const gamePlayerExists = async (gameId, username) => {
  let exists = false;

  await getGame(gameId).then(async (game) => {
    // Check if the player username is in the players array
    if (game && game.players.includes(username)) {
      exists = true;
    }
  });

  return exists;
};

// Add a player to the game
const addGamePlayer = async (gameId, username) => {
  let added = false;

  // Get the game to update
  await getGame(gameId).then(async (game) => {
    // Add the user to the game and save
    if (game && game.players.length < 2 && !game.players.includes(username)) {
      game.players.push(username);
      await game.save();

      added = true;
    }
  });

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

// Switch the next move on a game and return the next player
const switchMove = async (gameId, currentPlayer) => {
  let nextPlayer = -1;

  // Get the game to update
  await getGame(gameId).then(async (game) => {
    // Switch the next move to the new player
    if (game && game.nextMove != -1) {
      if (currentPlayer == 0) {
        game.nextMove = 1;
      } else if (currentPlayer == 1) {
        game.nextMove = 0;
      }
      await game.save();

      nextPlayer = game.nextMove;
    }
  });

  return nextPlayer;
};

// Update the state for a game
const updateState = async (gameId, state) => {
  let updated = false;

  await getGame(gameId).then(async (game) => {
    if (game) {
      game.state = state;
      await game.save();

      updated = true;
    }
  });

  return updated;
};

// Update the winner for a game
const updateWinner = async (gameId, username) => {
  let updated = false;

  await getGame(gameId).then(async (game) => {
    if (game) {
      game.winner = username;
      await game.save();

      updated = true;
    }
  });

  return updated;
};

// Get the player score
const getPlayerScores = async (gameId) => {
  let scores = [-1, -1];

  await getGame(gameId).then(async (game) => {
    if (game) {
      scores = [game.scoreOne, game.scoreTwo];
    }
  });

  return scores;
};

module.exports = {
  getGame,
  getGamePlayerCount,
  getGamePlayers,
  getGamePlayer,
  getRandomPlayer,
  getPlayerScores,
  gamePlayerExists,
  addGamePlayer,
  updateState,
  updateWinner,
  updateNextMove,
  switchMove,
};

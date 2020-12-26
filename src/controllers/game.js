const Game = require("../models/Game");

const testID = "5fe570db883ea74b84e9fe3b";

// Get a game based on ID
const getGame = async (id) => {
  const game = await Game.findById(id).exec();
  console.log("Found game: ", game);
  return game;
};

// Add a player to the game
const addGamePlayer = async (username) => {
  let added = false;

  // Get the game to update
  await getGame(testID).then(async (game) => {
    console.log("Game to add player: ", game);

    // Add the user to the game and save
    if (game && game.players.length < 2) {
      game.players.push(username);
      await game.save();

      added = true;
    }
  });

  console.log("Added: ", added);
  return added;
};

// Get the total number of players
const getGamePlayerCount = async () => {
  let count = -1;

  await getGame(testID).then((game) => {
    if (game) {
      count = game.players.length;
    }
  });

  console.log("Got game length: ", count);
  return count;
};

// Get a random player from the game
const getRandomPlayer = async () => {
  let p;

  await getGame(testID).then((game) => {
    if (game) {
      p = Math.floor(Math.random() * game.players.length);
    }
  });

  return p;
};

// Get all the game players
const getGamePlayers = async () => {
  let players = [];

  await getGame(testID).then((game) => {
    if (game) {
      players = game.players;
    }
  });

  return players;
};

// Get a player from the array
const getGamePlayer = async (i) => {
  let player;

  await getGame(testID).then((game) => {
    if (game) {
      player = game.players[i];
    }
  });

  return player;
};

module.exports = {
  getGame,
  getGamePlayerCount,
  getGamePlayers,
  getGamePlayer,
  getRandomPlayer,
  addGamePlayer,
};

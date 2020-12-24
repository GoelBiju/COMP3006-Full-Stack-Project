// const mongoose = require("mongoose");

// Create Game schema
// const schema = mongoose.Schema({
//   playerOne: String,
//   playerTwo: String,
//   nextMove: Number,
// });

const gamePlayers = [];

// Get the total number of players
const getGamePlayerCount = () => gamePlayers.length;

// Get all the game players
const getGamePlayers = () => gamePlayers;

// Get a player from the array
const getGamePlayer = (i) => gamePlayers[i];

// Get a random player from the game
const getRandomPlayer = () => Math.floor(Math.random() * gamePlayers.length);

// Add a player to the game
const addGamePlayer = (username) => {
  if (gamePlayers.length < 2) {
    // Add the user to the game
    gamePlayers.push(username);
    return true;
  }
  return false;
};

module.exports = {
  getGamePlayerCount,
  getGamePlayers,
  getGamePlayer,
  getRandomPlayer,
  addGamePlayer,
};

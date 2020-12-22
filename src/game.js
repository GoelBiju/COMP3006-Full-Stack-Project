// const gameName = "test";
const gamePlayers = [];

// Get the total number of players
const getGamePlayerCount = () => gamePlayers.length;

// Get the players array
// const getGamePlayers = () => gamePlayers;

// Get a random player from the game
const getRandomPlayer = () =>
  gamePlayers[Math.floor(Math.random() * gamePlayers.length)];

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
  // getGamePlayers,
  getRandomPlayer,
  addGamePlayer,
};

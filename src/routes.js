let path = require("path");
const Game = require("./models/Game");

async function homeRoute(req, res) {
  const { username } = req.user;
  let gameHistory = [];

  // Get all the user's games
  const games = await Game.find({ players: username }).exec();
  if (games) {
    gameHistory = games
      .filter((g) => [1, 2, 3, 4].includes(g.state))
      .map((g) => ({
        date: g.createdAt,
        opponent: g.players.find((p) => p != username),
        scores: [g.scoreOne, g.scoreTwo],
        winner: g.winner,
        state: g.state,
      }));
    console.log("Got user games: ", gameHistory);
  } else {
    res.json({
      message: `An error occurred: ${err}`,
    });
  }

  // Get all the games
  res.render("home", {
    username,
    gameHistory,
  });
}

function gameRoute(req, res) {
  // Get the logged in username
  const { username } = req.user;
  const { gameId } = req.params;

  // Check if the game exists
  Game.findById(gameId, function (err, game) {
    if (game) {
      // Allow if this game has not been started or
      // if the user is present in an "in-play" game
      if (
        game.state == -1 ||
        (game.state == 0 && game.players.includes(username))
      ) {
        res.render("game", { username, gameId });
      } else {
        res.json({
          message: `You are not permitted to access this game`,
        });
      }
    } else {
      res.json({
        message: `No game found under ${gameId}`,
      });
    }
  });
}

function loginRoute(req, res) {
  res.render("login");
}

function registerRoute(req, res) {
  res.render("register");
}

module.exports = {
  homeRoute,
  gameRoute,
  loginRoute,
  registerRoute,
};

let path = require("path");
const Game = require("./models/Game");

async function homeRoute(req, res) {
  const { username } = req.user;
  let userGames = [];

  // Get all the user's games
  await Game.find({ players: username })
    .then((games) => {
      userGames = games.map((g) => {
        g._id, g.state;
      });
    })
    .catch((err) => {
      res.json({
        message: `An error occurred: ${err}`,
      });
    });

  console.log("Got user games: ", userGames);

  // Get all the games
  res.render("home", { username });
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

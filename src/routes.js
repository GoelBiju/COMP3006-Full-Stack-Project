let path = require("path");

function homeRoute(req, res) {
  const { username } = req.user;
  res.render("home", { username });
}

function gameRoute(req, res) {
  // TODO: Check if the game exists

  // Get the logged in username
  const { username } = req.user;
  res.render("game", { username, gameId: req.params.gameId });
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

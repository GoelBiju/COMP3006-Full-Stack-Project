let path = require("path");

function homeRoute(req, res) {
  res.render("home");
}

function gameRoute(req, res) {
  res.render("game", { gameId: req.params.gameId });
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

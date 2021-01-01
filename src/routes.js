let path = require("path");

function homeRoute(req, res) {
  res.render("home");
}

function gameRoute(req, res) {
  // res.sendFile(path.join(__dirname, "views/index.html"));
  res.render("game", { gameId: req.params.game });
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

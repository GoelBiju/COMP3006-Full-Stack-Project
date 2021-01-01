let path = require("path");

function homeRoute(req, res) {
  res.render("pages/home");
}

function gameRoute(req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
  // res.render("game", { gameId: req.params.game });
}

function loginRoute(req, res) {
  res.render("pages/login");
}

function registerRoute(req, res) {
  res.render("pages/register");
}

module.exports = {
  homeRoute,
  gameRoute,
  loginRoute,
  registerRoute,
};

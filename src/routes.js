let path = require("path");

function gameRoute(req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
}

function landingRoute(req, res) {
  res.render("game", { gameId: req.params.game });
}

function loginRoute(req, res) {
  res.render("pages/login");
}

function registerRoute(req, res) {
  res.render("pages/register");
}

module.exports = {
  landingRoute,
  loginRoute,
  registerRoute,
  gameRoute,
};

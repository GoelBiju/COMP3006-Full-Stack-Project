let path = require("path");

function landingRoute(req, res) {
  res.render("game", { gameId: req.params.game });
}

function loginRoute(req, res) {
  res.render("login");
}

function gameRoute(req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
}

module.exports = {
  landingRoute,
  loginRoute,
  gameRoute,
};

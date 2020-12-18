let path = require("path");

function gameRoute(request, response) {
  response.sendFile(path.join(__dirname, "views/index.html"));
}

module.exports.gameRoute = gameRoute;

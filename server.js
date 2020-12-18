let express = require("express");
let routes = require("./routes");

let app = express();

app.get("/game", routes.gameRoute);

module.exports.app = app;

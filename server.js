let express = require("express");
let path = require("path");

let routes = require("./src/routes");

// Initialise the app
let app = express();

// Configure to use statics
app.use(express.static(path.join(__dirname, "public")));

app.get("/", routes.gameRoute);

module.exports.app = app;

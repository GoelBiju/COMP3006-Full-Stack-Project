let express = require("express");
let http = require("http");
let path = require("path");
let socketIo = require("socket.io");
let mongoose = require("mongoose");

let routes = require("./src/routes");
let socketHandle = require("./src/socket");

const Game = require("./src/models/Game");

// Database connection
let mongoDBUrl = "mongodb://localhost:27017/connect4";

mongoose
  .connect(mongoDBUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    mongoose.set("debug", true);
    console.log("Connected to database.");

    // Create a single game.
    Game.findById("5fe570db883ea74b84e9fe3b", function (err, game) {
      game.players = [];
      game.save();
    });
  });

// Initialise the app
let app = express();
let server = http.createServer(app);

// Configure to use statics
app.use(express.static(path.join(__dirname, "public")));

// Set up websocket.
let io = socketIo(server);

// Define routes.
app.get("/", routes.gameRoute);

// Handle websocket connections.
io.on("connection", socketHandle.handleConnection);

const cleanUp = (eventType) => {
  stop();
};

[
  `exit`,
  `SIGINT`,
  `SIGUSR1`,
  `SIGUSR2`,
  `uncaughtException`,
  `SIGTERM`,
].forEach((eventType) => {
  process.on(eventType, cleanUp.bind(null, eventType));
});

function stop() {
  mongoose.connection.close(() => {
    console.info("closed");
    server.close();
    process.exit();
  });
}

module.exports.app = server;
module.exports.stop = stop;

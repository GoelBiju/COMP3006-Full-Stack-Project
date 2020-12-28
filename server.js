let express = require("express");
let http = require("http");
let path = require("path");
let socketIo = require("socket.io");
let mongoose = require("mongoose");

let routes = require("./src/routes");
let socketHandle = require("./src/socket");

const Game = require("./src/models/Game");

// Database connection using Heroku or localhost
let mongoDBUrl =
  process.env.MONGODB_URI || "mongodb://localhost:27017/connect4";

mongoose
  .connect(mongoDBUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(async () => {
    console.log("Connected to database.");

    // Create a single game.
    await Game.findById("1", async function (err, game) {
      if (game) {
        game.players = [];
        game.board = [
          [-1, -1, -1, -1, -1, -1, -1],
          [-1, -1, -1, -1, -1, -1, -1],
          [-1, -1, -1, -1, -1, -1, -1],
          [-1, -1, -1, -1, -1, -1, -1],
          [-1, -1, -1, -1, -1, -1, -1],
          [-1, -1, -1, -1, -1, -1, -1],
        ];
        game.nextMove = -1;

        game.save();
        console.log("Reset test values.");
      } else {
        console.log("No game with ID: 1");

        const g = await Game.create({ _id: "1" });
        await g.save();
        console.log("New game with ID: ", g._id);
      }
    });

    // Set mongoose debugging information to show in console
    mongoose.set("debug", true);
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

module.exports = {
  app: server,
  stop: stop,
};

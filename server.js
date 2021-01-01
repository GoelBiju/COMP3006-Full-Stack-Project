const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
const mongoose = require("mongoose");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Page routes.
let routes = require("./src/routes");
let socketHandle = require("./src/socket");

const authRoute = require("./src/apiRoutes/auth");
const authenticate = require("./src/middleware/authenticate");

// TODO: Needs to be removed once tested
const Game = require("./src/models/Game");

// Database connection using Heroku or localhost
let mongoDBUrl =
  process.env.MONGODB_URI || "mongodb://localhost:27017/connect4";

mongoose.connect(mongoDBUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// Hold a reference to the connection.
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", async () => {
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

// Set up websocket.
let io = socketIo(server);

// Configure app
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Configure to use statics
app.use(express.static(path.join(__dirname, "public")));

// Use ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

// Define page routes.
app.get("/", authenticate, routes.homeRoute);
app.get("/game", authenticate, routes.gameRoute);
app.get("/login", routes.loginRoute);
app.get("/register", routes.registerRoute);

// Define API routes.
app.use("/api", authRoute);

// Handle websocket connections.
io.on("connection", socketHandle.handleConnection);

// Cleanup functions for running locally
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

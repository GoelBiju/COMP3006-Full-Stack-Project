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

const authApiRoute = require("./src/apiRoutes/auth");
const gameApiRoute = require("./src/apiRoutes/game");
const authenticate = require("./src/middleware/authenticate");

const { createGame } = require("./src/controllers/GameController");

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
app.use(express.static(path.join(__dirname, "node_modules")));

// Use ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

// Define page routes.
app.get("/", authenticate, routes.homeRoute);
app.get("/game/:gameId", authenticate, routes.gameRoute);
app.get("/login", routes.loginRoute);
app.get("/register", routes.registerRoute);
app.get("/video", routes.videoRoute);

// Define API routes.
app.use("/api", authApiRoute);
app.use("/api", gameApiRoute);

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

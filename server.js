let express = require("express");
let http = require("http");
let path = require("path");
let socketIo = require("socket.io");
let mongoose = require("mongoose");

let routes = require("./src/routes");
let socketHandle = require("./src/socket");

// Database connection
let mongoUrl = "mongodb://localhost:27017/connect4";
mongoose.connect(mongoUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
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

module.exports.app = server;

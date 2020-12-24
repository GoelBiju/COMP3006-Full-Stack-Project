const {
  addGamePlayer,
  getRandomPlayer,
  getGamePlayerCount,
  getGamePlayer,
  getGamePlayers,
} = require("./models/Game");

// TODO: Implement rooms based on game
let nextMove = -1;

// Handle socket events.
function handleConnection(socket) {
  // Emit a connection success to client
  socket.emit("connection", "success");

  // Handle Join events.
  socket.on("join", (userInfo) => handleJoin(socket, userInfo));

  // Handle Move events.
  socket.on("move", (moveInfo) => handleMove(socket, moveInfo));
}

function handleJoin(socket, username) {
  console.log("User join request: ", username);

  // Add the user to the game.
  if (addGamePlayer(username)) {
    console.log("Added game player: ", username);

    if (getGamePlayerCount() == 2) {
      console.log("Game now full");
      // Choose a random player to start
      nextMove = getRandomPlayer();

      // Get all the players in this game.
      let gamePlayers = getGamePlayers();

      // Send to other player
      socket.broadcast.emit("game", {
        status: "start",
        opponent: username,
        gamePlayers,
        nextMove,
      });

      // Send back to client
      socket.emit("game", {
        status: "start",
        // Find the other players username
        opponent: gamePlayers.find((player) => player != username),
        gamePlayers,
        nextMove,
      });
      console.log("Sent game start, start player: ", nextMove);
    } else {
      socket.emit("game", { status: "wait" });
      console.log("Waiting for another player");
    }
  } else {
    // Reject if already full
    socket.emit("reject", "Game full, try again later");
    console.log(`Connection from ${username} rejected, game full`);
  }
}

function handleMove(socket, moveInfo) {
  console.log("Move info: ", moveInfo);
}

module.exports = {
  handleConnection,
};

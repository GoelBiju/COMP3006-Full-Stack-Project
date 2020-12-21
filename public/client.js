$(function () {
  // Create socket
  var socket = io();

  $("#connect").click(function () {
    // Send some user info
    socket.emit("join", { username: $("#player-name").val() });
  });

  // When receiving connected
  socket.on("connection", function (msg) {
    console.log("Message received: ", msg);
    $("#conn-status").html("Connected to server");
  });

  // When receiving game information
  socket.on("game", function (info) {
    console.log("Game info: ", info);
  });
});

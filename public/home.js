$(function () {
  // Create a game when clicking the button
  $("#createGameBtn").click(function () {
    $.get("/api/game", function (data) {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    });
  });
});
